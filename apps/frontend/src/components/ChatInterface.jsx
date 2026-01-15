import { useRef } from "react";
import { useSpeech } from "../hooks/useSpeech";
import { PersonalitySelector } from "./PersonalitySelector";

export const ChatInterface = ({ hidden, onNavigate, ...props }) => {
  const input = useRef();
  const { tts, loading, message, startRecording, stopRecording, recording, userMessage, personality, setPersonality } = useSpeech();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message && text.trim()) {
      tts(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
      <div className="flex justify-between items-start gap-4">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl text-gray-700">Digital Human</h1>
          <p className="text-gray-600">
            {loading ? "Loading..." : "Type a message and press enter to chat with the AI."}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          <PersonalitySelector 
            selectedPersonality={personality}
            onPersonalityChange={setPersonality}
          />
          {onNavigate && (
            <button
              onClick={() => onNavigate("dashboard")}
              className="self-start backdrop-blur-md bg-white bg-opacity-50 hover:bg-opacity-70 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all pointer-events-auto"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>
      
      {/* User Message Display */}
      {userMessage && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 max-w-sm">
          <div className="backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">You said:</p>
            <p className="text-lg leading-relaxed text-gray-600">{userMessage}</p>
          </div>
        </div>
      )}
      
      {/* AI Response Display */}
      {message && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 max-w-sm">
          <div className="backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Jack is saying:</p>
            <p className="text-lg leading-relaxed text-gray-600">{message.text}</p>
          </div>
        </div>
      )}
      
      <div className="w-full flex flex-col items-end justify-center gap-4"></div>
      <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`bg-gray-500 hover:bg-gray-600 text-white p-4 px-4 font-semibold uppercase rounded-md ${
            recording ? "bg-red-500 hover:bg-red-600" : ""
          } ${loading || message ? "cursor-not-allowed opacity-30" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
        </button>

        <input
          className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
          placeholder="Type a message..."
          ref={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          disabled={loading || message}
          onClick={sendMessage}
          className={`bg-gray-500 hover:bg-gray-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
            loading || message ? "cursor-not-allowed opacity-30" : ""
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};
