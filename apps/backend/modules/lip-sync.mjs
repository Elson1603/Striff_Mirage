import { convertTextToSpeech } from "./elevenLabs.mjs";
import { getPhonemes } from "./rhubarbLipSync.mjs";
import { readJsonTranscript, audioFileToBase64 } from "../utils/files.mjs";

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000; // 2 seconds delay between retries

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lipSync = async ({ messages }) => {
  console.log(`[LipSync] Starting lipSync for ${messages.length} messages`);
  
  // Phase 1: Convert text to speech
  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.mp3`;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          console.log(`[LipSync] Phase 1: Converting message ${index} to speech (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await convertTextToSpeech({ text: message.text, fileName });
          console.log(`[LipSync] Phase 1: Message ${index} converted to speech successfully`);
          break;
        } catch (error) {
          console.error(`[LipSync] Phase 1: Attempt ${attempt + 1} failed for message ${index}:`, error.message);
          if (error.response && error.response.status === 429 && attempt < MAX_RETRIES - 1) {
            const delayTime = RETRY_DELAY * (attempt + 1); // Exponential backoff
            console.log(`[LipSync] Rate limited (429), waiting ${delayTime}ms before retry...`);
            await delay(delayTime);
          } else if (attempt === MAX_RETRIES - 1) {
            console.error(`[LipSync] Phase 1: Max retries exceeded for message ${index}`);
            throw error;
          } else {
            throw error;
          }
        }
      }
    })
  );

  // Phase 2: Get phonemes and encode audio
  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.mp3`;

      try {
        console.log(`[LipSync] Phase 2: Getting phonemes for message ${index}`);
        await getPhonemes({ message: index });
        console.log(`[LipSync] Phase 2: Reading audio file for message ${index}`);
        message.audio = await audioFileToBase64({ fileName });
        console.log(`[LipSync] Phase 2: Audio encoded to base64, size: ${message.audio.length} bytes`);
        console.log(`[LipSync] Phase 2: Reading lipsync data for message ${index}`);
        message.lipsync = await readJsonTranscript({ fileName: `audios/message_${index}.json` });
        console.log(`[LipSync] Phase 2: Message ${index} complete`);
      } catch (error) {
        console.error(`[LipSync] Phase 2: Error processing message ${index}:`, error.message);
        console.error(`[LipSync] Full error:`, error);
      }
    })
  );

  console.log(`[LipSync] Completed processing all messages`);
  return messages;
};

export { lipSync };
