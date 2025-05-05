import { SqlDatabase } from "langchain/sql_db";
import { SqlToolkit } from "langchain/agents/toolkits/sql";
import { AgentExecutor } from "langchain/agents";
import { RunnableSequence } from "@langchain/core/runnables"
import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import * as dotenv from "dotenv";
import CustomOutputParser from "./custom-output-parser.js";
import { datasource, MAX_ITERATIONS } from "./constants.js";
import { llm } from "./llm.js";
import { newPrompt } from "./prompt-templates.js";
dotenv.config();

const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
    includeTables: ['key_dictionary', 'ts_kv'],
});

const sqlToolKit = new SqlToolkit(db);
const tools = sqlToolKit.getTools();

const modelWithFunctions = llm.bind({
    functions: tools.map(tool => convertToOpenAIFunction(tool)),
});

const runnableAgent = RunnableSequence.from([
    {
        input: (i) => i.input,
        agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
    },
    newPrompt,
    modelWithFunctions,
    new CustomOutputParser(),
]);

const agentExecutor = new AgentExecutor({
    agent: runnableAgent,
    tools,
    verbose: true,
    maxIterations: MAX_ITERATIONS
});

const analyzeData = async (entityId, keyName, startTime, endTime) => {
    const input = `
    Retrieve the key_id from the key_dictionary table where key is '${keyName}'.
    Then, retrieve data from the ts_kv table where entity_id is '${entityId}' key is key_id from previous request and ts is between ${startTime} and ${endTime}.
    Return data from second query as result and try to guess the next two ts and long_v pairs, ignore all other steps, return prediction event if you're not sure about it.
  `;
    // Try to guess the next two ts and long_v pairs
    // provide data ts and long_v pairs

    try {
        console.log('Input to be sent:', input);
        const response = await agentExecutor.invoke({ input: input, agent_scratchpad: "" });
        console.log('Prediction response:', response);
        const output = response.output;

        if (output.includes("Prediction:")) {
            console.log('Received final result. Terminating...');
            await datasource.destroy();
            console.log('Datasource destroyed');
            return output;
        } else {
            console.log('Unexpected output format, terminating...');
            await datasource.destroy();
            console.log('Datasource destroyed');
            return output;
        }

    } catch (err) {
        console.error('Error with OpenAI prediction:', err);
        await datasource.destroy();
        console.log('Datasource destroyed');
    }
};

// Example usage
const entityId = '3c43d1f0-0086-11ef-925e-a532ea6dfe95';
const keyName = 'totalMsgs';
const startTime = 1713776200771;
const endTime = 1713776800974;

analyzeData(entityId, keyName, startTime, endTime);

