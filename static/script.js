const audioPlayer = document.getElementById('audio-player');
const textDisplay = document.getElementById('ai-text');

let currentMouthId = 'mouth-X'; // Start with idle mouth
let syncData = null;
let animationFrameRequest;

// Function to swap mouth images
function setMouth(phonemeChar) {
    const newMouthId = 'mouth-' + phonemeChar;
    
    // Don't do anything if it's the same mouth
    if (newMouthId === currentMouthId) return;

    // Hide current mouth
    document.getElementById(currentMouthId).classList.add('hidden');
    
    // Show new mouth
    const newMouthImg = document.getElementById(newMouthId);
    if (newMouthImg) {
        newMouthImg.classList.remove('hidden');
        currentMouthId = newMouthId;
    } else {
        // Fallback to X if a weird phoneme shows up
        console.warn("Missing image for phoneme:", phonemeChar);
        document.getElementById('mouth-X').classList.remove('hidden');
        currentMouthId = 'mouth-X';
    }
}

// The Lip Sync Animation Loop (runs 60fps while audio plays)
function animateLips() {
    if (audioPlayer.paused || audioPlayer.ended) {
        setMouth('X'); // Reset to idle when done
        cancelAnimationFrame(animationFrameRequest);
        return;
    }

    const currentTime = audioPlayer.currentTime;

    // Find the active cue in Rhubarb data based on current time
    // Rhubarb JSON format: { mouthCues: [ {start: 0.0, end: 0.2, value: 'X'}, ... ] }
    if (syncData && syncData.mouthCues && syncData.mouthCues.length > 0) {
        const activeCue = syncData.mouthCues.find(cue => 
            currentTime >= cue.start && currentTime < cue.end
        );

        if (activeCue) {
            setMouth(activeCue.value);
        }
    } else {
        // Fallback: Simple alternating mouth animation when no lip-sync data
        const mouthShapes = ['A', 'B', 'C', 'D', 'E', 'F'];
        const frameRate = 10; // Change mouth every 10 frames (~6 times per second)
        const frameIndex = Math.floor((currentTime * 60) / frameRate) % mouthShapes.length;
        setMouth(mouthShapes[frameIndex]);
    }

    // Keep looping
    animationFrameRequest = requestAnimationFrame(animateLips);
}


// Send message to backend
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const text = inputField.value;
    if (!text) return;

    inputField.value = "";
    textDisplay.innerText = "Processing...";
    
    try {
        const response = await fetch('/process_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        if (data.error) {
            textDisplay.innerText = "Error: " + data.error;
            return;
        }

        textDisplay.innerText = data.text;
        
        // 1. Load Audio
        audioPlayer.src = data.audio_url;
        
        // 2. Load Sync Data
        syncData = data.sync_data;
        console.log("Sync data loaded:", syncData);

        // 3. Play and Start Animation Loop
        audioPlayer.play().then(() => {
            cancelAnimationFrame(animationFrameRequest); // Stop any old loops
            animateLips(); // Start new loop
        });
        
    } catch (error) {
        console.error("Error:", error);
        textDisplay.innerText = "Connection Error.";
    }
}

// Voice Input using Web Speech API
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition not supported. Please use Chrome.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    const micBtn = document.getElementById('mic-btn');
    const inputField = document.getElementById('user-input');

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    micBtn.innerText = '🔴 Listening...';
    micBtn.disabled = true;

    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        inputField.value = transcript;
        sendMessage();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        micBtn.innerText = '🎤 Speak';
        micBtn.disabled = false;
    };

    recognition.onend = function() {
        micBtn.innerText = '🎤 Speak';
        micBtn.disabled = false;
    };
}

// Enter key support
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage();
});

// Ensure mouth resets if audio ends abruptly
audioPlayer.onended = () => setMouth('X');