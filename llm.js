import { OpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
dotenv.config();

export const llm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0,
    // outputParser: new PredictionOutputParser()
});