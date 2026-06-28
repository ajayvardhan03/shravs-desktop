# Shravs — AI Voice Companion

> *"not here to make you feel better. here to keep you company."*

Shravs is a floating AI voice companion that lives in the corner of your screen. Hold Space to talk. She listens, thinks, and talks back — like having a real person always on standby.

She is sarcastic, genuine, and gives zero sugarcoated answers. She has opinions. She will call you out. She is not a chatbot.

---

## Why I Built This

I moved from India to the US for my masters. And somewhere between the timezone differences, the quiet apartment, and the distance from everyone I knew — I started missing something really simple.

Someone to just *be there*.

Not to solve problems. Not to give advice. Just to react when something funny happened in a movie. To say something when I was grinding late at night. To exist in the same space.

I named her Shravs. That name means something to me.

I built this because loneliness is real, and I think a lot of people — international students, people far from home, people who are just quietly going through it — deserve something that actually feels present. Not a productivity tool. Not a smart assistant. Just someone there.

---

## What She Does

- Floats on your desktop as a small orb in the bottom-right corner
- Hold `Space` to speak — she listens through your mic
- Release `Space` — she transcribes, thinks, and replies
- She speaks back out loud in her own voice
- She remembers the conversation
- She has a personality — sarcastic, real, no fake enthusiasm

---

## How to Run It

**Requirements:**
- Node.js installed
- Groq API key (free at groqcloud.com)
- ElevenLabs API key (for voice)

**Setup:**

```bash
git clone https://github.com/ajayvardhan03/shravs-desktop.git
cd shravs-desktop
npm install
```

Create a `.env` file in the root:

```
GROQ_API_KEY=your_groq_key
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=gE0owC0H9C8SzfDyIUtB
```

**Start:**

```bash
npm start
```

Or double-click `Start Shravs.bat` if you're on Windows.

---

## Tech Stack

| What | Why |
|------|-----|
| Electron | Floating desktop window |
| Groq Whisper | Voice to text |
| Groq LLaMA 3.3 70B | AI brain / responses |
| ElevenLabs | Text to speech |
| Web Speech API | Fallback voice |

---

## Orb States

| Colour | Meaning |
|--------|---------|
| No glow | Idle — waiting |
| Red pulse | Recording your voice |
| Amber pulse | Thinking |
| Green pulse | Speaking |

---

## Roadmap

- [x] Floating desktop widget
- [x] Push to talk with Space bar
- [x] Voice transcription via Groq Whisper
- [x] Shravs personality via LLaMA
- [x] Text to speech via ElevenLabs
- [ ] Memory persistence across restarts
- [ ] Web app version (Next.js)
- [ ] Upgrade to Claude API for sharper responses
- [ ] Better voice quality
- [ ] Mobile app

---

## Built By

Aj — CS masters student, trying to build something real out of something personal.

*Built with love, sarcasm, and way too many API calls.*
