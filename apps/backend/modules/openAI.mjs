import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";
import { personalities } from "./personalities.mjs";

dotenv.config();

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "-",
  modelName: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
  temperature: 0.2,
});

// Create dynamic chain based on personality
const createGeminiChain = (personalityKey = "worldTraveler") => {
  const personality = personalities[personalityKey] || personalities.worldTraveler;
  
  const template = `${personality.prompt}`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["ai", template],
    ["human", "{question}"],
  ]);

  return prompt.pipe(model).pipe(parser);
};

export { createGeminiChain, parser, personalities };

