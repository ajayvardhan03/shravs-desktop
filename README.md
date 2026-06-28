# Shravs Desktop

A floating AI voice companion that lives on your screen. Hold Space to talk — she listens, thinks, and talks back.

No sugarcoating. No corporate vibes. Just Shravs.

---

## What it does

- Floating bubble in the bottom-right corner of your screen
- Hold **Space** to record your voice
- Release to send — she transcribes, replies, and speaks back
- Always on top, minimal, stays out of your way

---

## Tech Stack

| Layer | Tool |
|---|---|
| Desktop window | Electron |
| Voice → Text | Groq Whisper |
| AI replies | Groq LLaMA 3.3 70B |
| Text → Voice | ElevenLabs / Web Speech API |

---

## Setup

**1. Clone the repo**
```bash
git clone https://github.com/ajayvardhan03/shravs-desktop.git
cd shravs-desktop
```

**2. Install dependencies**
```bash
npm install
```

**3. Add your API keys**

Create a `.env` file in the root:
```
GROQ_API_KEY=your_groq_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
```

Get your keys:
- Groq → https://console.groq.com
- ElevenLabs → https://elevenlabs.io

**4. Run it**
```bash
npm start
```

---

## Usage

| Action | Result |
|---|---|
| Hold `Space` | Shravs listens |
| Release `Space` | She thinks and replies |
| Speech bubble | Her reply appears above the orb |
| Click `✕` | Close the bubble |

---

## Bubble States

| Colour | Meaning |
|---|---|
| No glow | Idle |
| 🔴 Red | Recording |
| 🟡 Amber | Thinking |
| 🟢 Green | Speaking |

---

## Notes

- ElevenLabs free plan doesn't support API voices — the app automatically falls back to the browser's built-in Web Speech API
- Your `.env` file is gitignored — never commit your API keys

---

*Built by Ajay · v1*
