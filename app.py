import os
import json
import re
import uuid
import subprocess  # <--- Needed to run Rhubarb

# Configure ffmpeg path BEFORE importing pydub
os.environ["PATH"] += os.pathsep + r"C:\Users\elson\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin"

import google.generativeai as genai
from flask import Flask, render_template, request, jsonify, url_for
from gtts import gTTS
from pydub import AudioSegment  # For audio conversion

app = Flask(__name__)

# --- CONFIGURATION ---
GOOGLE_API_KEY = "AIzaSyBao3SWDR6ouZqLg7jUiSVdcQQKupZ9iBA"
# Path to Rhubarb executable
RHUBARB_PATH = os.path.join(app.root_path, 'Rhubarb', 'Rhubarb-Lip-Sync-1.14.0-Windows', 'rhubarb.exe')
MEMORY_FILE = "memory.json"

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

# (Memory functions load_memory/save_memory remain the same as before...)
def load_memory():
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, 'r') as f: return json.load(f)
        except: pass
    return []

def save_memory(history):
    serializable = []
    for msg in history:
        role = "user" if msg.role == "user" else "model"
        serializable.append({"role": role, "parts": [msg.parts[0].text]})
    with open(MEMORY_FILE, 'w') as f: json.dump(serializable, f)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/process_message', methods=['POST'])
def process_message():
    user_input = request.json.get('message')
    history = load_memory()
    chat = model.start_chat(history=history)

    system_prompt = "You are Mirage. Keep answer under 2 sentences."
    
    try:
        # 1. Get AI Text
        response = chat.send_message(f"{system_prompt}\nUser: {user_input}")
        clean_text = response.text
        
        # 2. Generate Audio
        unique_id = uuid.uuid4().hex
        mp3_filename = f"resp_{unique_id}.mp3"
        wav_filename = f"resp_{unique_id}.wav"
        mp3_path = os.path.join(app.root_path, 'static', 'audio', mp3_filename)
        wav_path = os.path.join(app.root_path, 'static', 'audio', wav_filename)
        os.makedirs(os.path.dirname(mp3_path), exist_ok=True)
        
        # Generate MP3 with gTTS
        tts = gTTS(text=clean_text, lang='en')
        tts.save(mp3_path)
        
        # Convert MP3 to WAV for Rhubarb
        audio = AudioSegment.from_mp3(mp3_path)
        audio.export(wav_path, format="wav")

        # 3. RUN RHUBARB LIP SYNC (Optional - fallback if not available)
        # We tell Rhubarb to output JSON format (-f json)
        lip_sync_data = {"mouthCues": []}
        
        if os.path.exists(RHUBARB_PATH):
            command = [RHUBARB_PATH, "-f", "json", wav_path]
            
            print(">> Running Rhubarb...")
            try:
                # Run command and capture output
                result = subprocess.run(command, capture_output=True, text=True)
                
                if result.returncode != 0:
                    print(f"Rhubarb Error: {result.stderr}")
                else:
                    # Parse Rhubarb's JSON output
                    lip_sync_data = json.loads(result.stdout)
                    print(">> Rhubarb sync generated.")
            except Exception as rhubarb_error:
                print(f"Rhubarb execution failed: {rhubarb_error}")
        else:
            print(">> Rhubarb not found, using simple animation fallback")

        save_memory(chat.history)

        return jsonify({
            "text": clean_text,
            # Send web-accessible URL for audio (use MP3 for better browser compatibility)
            "audio_url": url_for('static', filename=f'audio/{mp3_filename}'),
            # Send the phoneme timings
            "sync_data": lip_sync_data
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ensure audio temp folder exists
    os.makedirs(os.path.join(app.root_path, 'static', 'audio'), exist_ok=True)
    app.run(debug=True)
