# 🤖 Striff Mirage - Digital Human AI Assistant

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![Three.js](https://img.shields.io/badge/three.js-0.160.0-000000.svg)

*An interactive 3D AI-powered digital human assistant with real-time conversation capabilities*

[Features](#-features) • [Architecture](#-architecture) • [Setup](#-installation--setup) • [Usage](#-usage) • [API](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

<details>
<summary>Click to expand</summary>

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

</details>

---

## 🌟 Overview

**Striff Mirage** is a cutting-edge digital human AI assistant that combines the power of 3D graphics with advanced AI language models. It features a realistic 3D avatar that responds to user queries with synchronized lip movements and natural speech, creating an immersive conversational experience.

### Key Capabilities
- 🗣️ **Natural Conversations** - Powered by Google Gemini AI
- 🎭 **Realistic Avatar** - 3D digital human with facial expressions
- 🔊 **Voice Synthesis** - High-quality text-to-speech using ElevenLabs
- 🎤 **Speech Recognition** - Voice input support with Whisper
- 📊 **Analytics Dashboard** - Track interactions and performance
- 🌐 **Web-Based** - Runs entirely in the browser

---

## ✨ Features

<details>
<summary><b>🎨 3D Avatar System</b></summary>

- Photorealistic 3D digital human
- Real-time facial animations
- Lip-sync with speech output
- Dynamic expressions based on conversation context
- Built with React Three Fiber and Three.js

</details>

<details>
<summary><b>💬 AI Conversation Engine</b></summary>

- Google Gemini AI integration for intelligent responses
- Context-aware conversations
- Multi-turn dialogue support
- Fallback responses for error handling
- Customizable personality and tone

</details>

<details>
<summary><b>🔊 Audio Features</b></summary>

- Text-to-speech powered by ElevenLabs
- Multiple voice options
- Speech-to-text using OpenAI Whisper
- Automatic lip-sync generation
- Audio recording and playback

</details>

<details>
<summary><b>📊 Analytics Dashboard</b></summary>

- Real-time interaction metrics
- User satisfaction tracking
- Response time monitoring
- System uptime statistics
- Visual data representations

</details>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │ Dashboard  │  │ Chat Interface│  │  3D Avatar      │    │
│  │ Analytics  │  │ Voice Input   │  │  (Three.js)     │    │
│  └────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Express)                        │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │   Gemini   │  │  ElevenLabs  │  │    Whisper      │    │
│  │   AI API   │  │     TTS      │  │      STT        │    │
│  └────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

For a detailed architecture diagram, see [resources/architecture.drawio.svg](resources/architecture.drawio.svg).

---

## 🛠️ Tech Stack

<details>
<summary><b>Frontend</b></summary>

- **React** 18.2.0 - UI framework
- **React Three Fiber** 8.15.13 - 3D rendering
- **@react-three/drei** 9.93.0 - 3D helpers
- **Three.js** 0.160.0 - 3D graphics library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Leva** - GUI controls for debugging

</details>

<details>
<summary><b>Backend</b></summary>

- **Express.js** - Web server framework
- **Google Gemini AI** (@langchain/google-genai) - Language model
- **LangChain** - AI orchestration
- **ElevenLabs** - Text-to-speech API
- **OpenAI Whisper** (nodejs-whisper) - Speech-to-text
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

</details>

---

## 🚀 Installation & Setup

<details>
<summary><b>Prerequisites</b></summary>

- **Node.js** >= 18.0.0
- **Yarn** package manager (or npm)
- **API Keys** for:
  - Google Gemini AI
  - ElevenLabs
  - OpenAI (for Whisper)

</details>

<details open>
<summary><b>Step-by-Step Installation</b></summary>

### 1. Clone the Repository

```bash
git clone https://github.com/Elson1603/Striff_Mirage.git
cd Striff_Mirage
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
yarn install

# Or if using npm
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `apps/backend` directory:

```bash
cd apps/backend
touch .env
```

Add the following environment variables:

```env
# Google Gemini AI
GOOGLE_API_KEY=your_google_gemini_api_key_here

# ElevenLabs API
ELEVEN_LABS_API_KEY=your_elevenlabs_api_key_here

# OpenAI (for Whisper)
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration (optional)
PORT=3000
```

### 4. Start the Development Server

```bash
# From the root directory, start both frontend and backend
yarn dev

# Or start them separately:
yarn client  # Frontend only (port 5173)
yarn server  # Backend only (port 3000)
```

### 5. Open the Application

Navigate to `http://localhost:5173` in your browser.

</details>

<details>
<summary><b>🐳 Docker Setup (Optional)</b></summary>

Coming soon! Docker support will be added in future releases.

</details>

---

## 💻 Usage

<details>
<summary><b>Getting Started</b></summary>

1. **Launch the Dashboard**: Upon opening the app, you'll see the analytics dashboard
2. **Navigate to Chat**: Click the "Go to Chat" button
3. **Start Conversing**: 
   - Type your message in the chat input
   - Or click the microphone icon for voice input
4. **Interact with Avatar**: Watch the 3D avatar respond with synchronized lip movements
5. **Return to Dashboard**: Use the navigation to view analytics

</details>

<details>
<summary><b>Chat Interface Tips</b></summary>

- **Text Input**: Type your questions or messages in the input field
- **Voice Input**: Click the microphone icon and speak clearly
- **Clear Conversation**: Use the interface controls to reset the chat
- **View History**: Scroll through previous messages in the chat window

</details>

<details>
<summary><b>Dashboard Analytics</b></summary>

The dashboard provides insights into:
- Total interactions count
- Average response time
- User satisfaction metrics
- System uptime percentage
- Interaction patterns over time
- Sentiment analysis

</details>

---

## 📡 API Reference

<details>
<summary><b>Backend Endpoints</b></summary>

### POST `/tts`

Convert text to speech with avatar animation data.

**Request Body:**
```json
{
  "message": "Hello, how can I help you today?"
}
```

**Response:**
```json
{
  "messages": [
    {
      "text": "Hello! I'm here to assist you.",
      "audio": "base64_encoded_audio_data",
      "lipsync": { /* lip-sync animation data */ },
      "facialExpression": "smile",
      "animation": "Idle"
    }
  ]
}
```

### POST `/sts`

Speech-to-Speech endpoint. Converts audio to text using Whisper, processes it with AI, and returns a complete response with audio and animation data.

**Request Body:**
```json
{
  "audio": "base64_encoded_audio_data"
}
```

**Response:**
```json
{
  "messages": [
    {
      "text": "The weather is sunny today!",
      "audio": "base64_encoded_audio_data",
      "lipsync": { /* lip-sync animation data */ },
      "facialExpression": "smile",
      "animation": "Talking"
    }
  ]
}
```

### GET `/voices`

Get available ElevenLabs voices.

**Response:**
```json
{
  "voices": [
    {
      "voice_id": "abc123",
      "name": "Rachel",
      "category": "premade"
    }
  ]
}
```

</details>

---

## ⚙️ Configuration

<details>
<summary><b>Frontend Configuration</b></summary>

Edit `apps/frontend/vite.config.js` to customize:
- Server port (default: 5173)
- Proxy settings
- Build output directory

</details>

<details>
<summary><b>Backend Configuration</b></summary>

Edit `apps/backend/server.js` to configure:
- Server port (default: 3000)
- CORS settings
- Request size limits
- API endpoints

</details>

<details>
<summary><b>Avatar Customization</b></summary>

Modify the avatar settings in `apps/frontend/src/components/Avatar.jsx`:
- 3D model paths
- Animation sets
- Facial expressions
- Morph targets
- Camera angles

</details>

---

## 🐛 Troubleshooting

<details>
<summary><b>Common Issues</b></summary>

### Avatar Not Loading
- Check browser console for errors
- Ensure 3D model files are accessible
- Verify WebGL support in your browser

### API Errors
- Verify all API keys are correctly set in `.env`
- Check API key permissions and quotas
- Review backend console logs for detailed errors

### Voice Not Working
- Ensure microphone permissions are granted
- Check browser audio settings
- Verify ElevenLabs API key is valid

### Build Failures
- Clear `node_modules` and reinstall: `rm -rf node_modules && yarn install`
- Check Node.js version: `node --version` (should be >= 18)
- Verify all dependencies are compatible

</details>

<details>
<summary><b>Getting Help</b></summary>

- 📖 Check the [documentation](https://github.com/Elson1603/Striff_Mirage/wiki) (coming soon)
- 🐛 Report bugs via [GitHub Issues](https://github.com/Elson1603/Striff_Mirage/issues)
- 💬 Join our community discussions
- 📧 Contact the maintainers

</details>

---

## 🤝 Contributing

<details>
<summary><b>How to Contribute</b></summary>

We welcome contributions! Here's how you can help:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Striff_Mirage.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add tests if applicable

4. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and feedback

</details>

<details>
<summary><b>Development Guidelines</b></summary>

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Document new features and APIs
- Test thoroughly before submitting
- Keep pull requests focused and atomic

</details>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Striff Mirage Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

<details>
<summary>Click to expand</summary>

- **Google Gemini AI** - For advanced language understanding
- **ElevenLabs** - For high-quality voice synthesis
- **OpenAI** - For Whisper speech recognition
- **Three.js Community** - For 3D graphics support
- **React Three Fiber** - For seamless React + Three.js integration
- All our contributors and supporters!

</details>

---

## 🔮 Roadmap

<details>
<summary><b>Upcoming Features</b></summary>

- [ ] Multi-language support
- [ ] Custom avatar creation tools
- [ ] Plugin system for extended functionality
- [ ] Mobile app versions (iOS/Android)
- [ ] Docker deployment support
- [ ] Real-time collaboration features
- [ ] Enhanced analytics and insights
- [ ] Voice cloning capabilities
- [ ] Emotion detection from user input
- [ ] Integration with more AI models

</details>

---

## 📞 Contact & Support

<div align="center">

**Found this project helpful? Give it a ⭐!**

[![GitHub stars](https://img.shields.io/github/stars/Elson1603/Striff_Mirage?style=social)](https://github.com/Elson1603/Striff_Mirage/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Elson1603/Striff_Mirage?style=social)](https://github.com/Elson1603/Striff_Mirage/network/members)

---

Made with ❤️ by the Striff Mirage Team

</div>
