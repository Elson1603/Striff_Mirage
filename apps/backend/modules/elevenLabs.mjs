import ElevenLabs from "elevenlabs-node";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendDir = join(__dirname, "..");

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = process.env.ELEVEN_LABS_VOICE_ID;
const modelID = process.env.ELEVEN_LABS_MODEL_ID;

if (!elevenLabsApiKey) {
  console.warn("WARNING: ELEVEN_LABS_API_KEY not set in environment variables");
}
if (!voiceID) {
  console.warn("WARNING: ELEVEN_LABS_VOICE_ID not set in environment variables");
}

const voice = new ElevenLabs({
  apiKey: elevenLabsApiKey,
  voiceId: voiceID,
});

async function convertTextToSpeech({ text, fileName }) {
  try {
    console.log(`[ElevenLabs] Starting TTS conversion for: ${fileName}`);
    console.log(`[ElevenLabs] Text: ${text.substring(0, 50)}...`);
    console.log(`[ElevenLabs] Backend directory: ${backendDir}`);
    
    const fullPath = join(backendDir, fileName);
    console.log(`[ElevenLabs] Full file path: ${fullPath}`);
    
    if (!elevenLabsApiKey) {
      throw new Error("ELEVEN_LABS_API_KEY not set in environment variables");
    }
    if (!voiceID) {
      throw new Error("ELEVEN_LABS_VOICE_ID not set in environment variables");
    }
    
    await voice.textToSpeech({
      fileName: fullPath,
      textInput: text,
      voiceId: voiceID,
      stability: 0.5,
      similarityBoost: 0.5,
      modelId: modelID,
      style: 1,
      speakerBoost: true,
    });
    console.log(`[ElevenLabs] TTS conversion completed successfully for: ${fileName}`);
  } catch (error) {
    console.error(`[ElevenLabs] Error during TTS conversion:`, error.message);
    if (error.response?.status === 401) {
      console.error(`[ElevenLabs] AUTHENTICATION ERROR: Invalid or expired API key`);
      console.error(`[ElevenLabs] Please check your ELEVEN_LABS_API_KEY environment variable`);
    }
    console.error(`[ElevenLabs] Full error:`, error);
    throw error;
  }
}

export { convertTextToSpeech, voice };
