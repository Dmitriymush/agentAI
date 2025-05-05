import { SemanticSimilarityExampleSelector } from "@langchain/core/example_selectors";
import { examples } from "./examples.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import {
    ChatPromptTemplate,
    FewShotPromptTemplate,
    HumanMessagePromptTemplate, MessagesPlaceholder,
    PromptTemplate,
    SystemMessagePromptTemplate
} from "@langchain/core/prompts";
import { SYSTEM_PREFIX } from "./constants.js";

const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
    examples,
    new OpenAIEmbeddings(),
    HNSWLib,
    {
        k: 2,
        inputKeys: ['input'],
    }
);

const fewShotPrompt = new FewShotPromptTemplate({
    exampleSelector,
    examplePrompt: PromptTemplate.fromTemplate(
        'User input: {input}\nSQL query: {query}'
    ),
    inputVariables: ['input', 'dialect', 'top_k'],
    prefix: SYSTEM_PREFIX,
    suffix: '',
});
const systemTemplate = new SystemMessagePromptTemplate(fewShotPrompt);
const humanMessage = new HumanMessagePromptTemplate(PromptTemplate.fromTemplate("{input}"));
const agentScratchpad = new MessagesPlaceholder("agent_scratchpad");

const prompt = ChatPromptTemplate.fromMessages([
    systemTemplate,
    humanMessage,
    agentScratchpad,
]);

export const newPrompt = await prompt.partial({
    dialect: 'postgres',
    top_k: '2'
});

// SINGLE MESSAGE EXAMPLE
// const prompt = ChatPromptTemplate.fromMessages([
//     ["system", SYSTEM_PREFIX],
//     ["human", "{input}"],
//     new MessagesPlaceholder('agent_scratchpad'),
// ]);