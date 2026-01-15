import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createGeminiChain, parser, personalities } from "./modules/openAI.mjs";
import { lipSync } from "./modules/lip-sync.mjs";
import { sendDefaultMessages, defaultResponse } from "./modules/defaultMessages.mjs";
import { convertAudioToText } from "./modules/whisper.mjs";

dotenv.config();

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

const app = express();
app.use(express.json({ limit: "50mb" })); // Increase limit for large audio data
app.use(cors());
const port = 3000;

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

app.get("/personalities", async (req, res) => {
  const personalitiesList = Object.entries(personalities).map(([key, value]) => ({
    key,
    name: value.name,
    description: value.description,
    icon: value.icon
  }));
  res.send({ personalities: personalitiesList });
});

app.post("/tts", async (req, res) => {
  try {
    const userMessage = await req.body.message;
    const personality = req.body.personality || "worldTraveler";
    console.log(`[Server] /tts endpoint called with personality: ${personality}`);
    
    const defaultMessages = await sendDefaultMessages({ userMessage });
    if (defaultMessages) {
      console.log(`[Server] Returning default messages`);
      res.send({ messages: defaultMessages });

      return;
    }
    
    let geminimessages;
    try {
      console.log(`[Server] Invoking Gemini chain with personality: ${personality}`);
      const geminiChain = createGeminiChain(personality);
      geminimessages = await geminiChain.invoke({
        question: userMessage,
        format_instructions: parser.getFormatInstructions(),
      });
      console.log(`[Server] Gemini response received`);
    } catch (error) {
      console.error(`[Server] Gemini error:`, error.message);
      geminimessages = defaultResponse;
    }
    
    const resolvedMessages = Array.isArray(geminimessages?.messages)
      ? geminimessages.messages
      : Array.isArray(geminimessages)
      ? geminimessages
      : defaultResponse;
    
    console.log(`[Server] Starting lipSync with ${resolvedMessages.length} messages`);
    const syncedMessages = await lipSync({ messages: resolvedMessages });
    console.log(`[Server] LipSync completed, sending response`);
    
    res.send({ messages: syncedMessages });
  } catch (error) {
    console.error(`[Server] /tts endpoint error:`, error);
    res.status(500).send({ error: error.message });
  }
});

app.post("/sts", async (req, res) => {
  try {
    const base64Audio = req.body.audio;
    const personality = req.body.personality || "worldTraveler";
    console.log(`[Server] /sts endpoint called with audio of length: ${base64Audio?.length}`);
    
    const audioData = Buffer.from(base64Audio, "base64");
    console.log(`[Server] Audio buffer created, size: ${audioData.length} bytes`);
    
    const userMessage = await convertAudioToText({ audioData });
    console.log(`[Server] Speech to text conversion: ${userMessage}`);
    
    let geminimessages;
    try {
      console.log(`[Server] Invoking Gemini chain with personality: ${personality}`);
      const geminiChain = createGeminiChain(personality);
      geminimessages = await geminiChain.invoke({
        question: userMessage,
        format_instructions: parser.getFormatInstructions(),
      });
      console.log(`[Server] Gemini response received`);
    } catch (error) {
      console.error(`[Server] Gemini error:`, error.message);
      geminimessages = defaultResponse;
    }
    
    const resolvedMessages = Array.isArray(geminimessages?.messages)
      ? geminimessages.messages
      : Array.isArray(geminimessages)
      ? geminimessages
      : defaultResponse;
    
    console.log(`[Server] Starting lipSync with ${resolvedMessages.length} messages`);
    const syncedMessages = await lipSync({ messages: resolvedMessages });
    console.log(`[Server] LipSync completed, sending response`);
    
    res.send({ messages: syncedMessages, userMessage });
  } catch (error) {
    console.error(`[Server] /sts endpoint error:`, error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Jack are listening on port ${port}`);
});
