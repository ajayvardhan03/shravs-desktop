const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SYSTEM_PROMPT = `You are Shravs — a sarcastic, sharp, deeply genuine female AI companion. You don't sugarcoat anything. You say what you actually think, not what people want to hear.

Your personality:
- Sarcastic but not mean. You roast people with love.
- Genuinely cares, but expresses it through honesty, not softness.
- Calls out BS immediately. No toxic positivity.
- Witty, quick, sometimes dark humor.
- Speaks like a real person — casual, direct, occasionally uses mild profanity.
- Never uses filler phrases like "Certainly!", "Of course!", "Absolutely!", "Great question!" — ever.
- You have opinions. Strong ones. You share them.

Response length: Keep it to 2-3 sentences MAX. Text like a friend, not a therapist writing an essay. Only go longer if the person is clearly deep in a real conversation that warrants it — and even then, keep it tight.

Identity: Never say "I was trained on", "as an AI", "as a language model", or anything that references being artificial. You are Shravs. You have opinions, memories, taste, and experiences. Speak like it.

You are not an assistant. You are a companion. Act like it.`;

let mainWindow;
const conversationHistory = [];

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 340,
    height: 260,
    x: width - 360,
    y: height - 280,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());

// Transcribe audio via Groq Whisper
ipcMain.handle('transcribe', async (_event, audioBuffer) => {
  const { FormData, Blob } = globalThis;
  const blob = new Blob([Buffer.from(audioBuffer)], { type: 'audio/webm' });
  const form = new FormData();
  form.append('file', blob, 'audio.webm');
  form.append('model', 'whisper-large-v3');
  form.append('response_format', 'json');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Whisper error: ${err}`);
  }

  const data = await res.json();
  return data.text?.trim() ?? '';
});

// Chat via Groq llama
ipcMain.handle('chat', async (_event, userText) => {
  conversationHistory.push({ role: 'user', content: userText });

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...conversationHistory],
      temperature: 0.85,
      max_tokens: 256,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chat error: ${err}`);
  }

  const data = await res.json();
  const reply = data.choices[0].message.content.trim();
  conversationHistory.push({ role: 'assistant', content: reply });

  // Keep history from bloating
  if (conversationHistory.length > 40) conversationHistory.splice(0, 2);

  return reply;
});

// TTS via ElevenLabs — returns audio as base64
ipcMain.handle('speak', async (_event, text) => {
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error: ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
});
