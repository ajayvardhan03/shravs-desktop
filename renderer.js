const orb = document.getElementById('orb');
const hint = document.getElementById('hint');
const speechBubble = document.getElementById('speech-bubble');
const closeBtn = document.getElementById('close');

closeBtn.addEventListener('click', () => window.close());

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let isProcessing = false;
let stream = null;
let bubbleTimeout = null;

function setStatus(state, hintText) {
  orb.className = state;
  hint.textContent = hintText;
}

function showBubble(text) {
  clearTimeout(bubbleTimeout);
  speechBubble.textContent = text;
  speechBubble.classList.add('visible');
}

function hideBubble(delay = 6000) {
  clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(() => speechBubble.classList.remove('visible'), delay);
}

async function speak(text) {
  try {
    const base64Audio = await window.shravs.speak(text);
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    await new Promise((resolve) => { audio.onended = resolve; audio.onerror = resolve; audio.play(); });
    URL.revokeObjectURL(url);
  } catch {
    await new Promise((resolve) => {
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 1.05;
      utt.pitch = 1.1;
      utt.onend = resolve;
      utt.onerror = resolve;
      speechSynthesis.speak(utt);
    });
  }
}

async function getStream() {
  if (!stream) {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  }
  return stream;
}

async function startRecording() {
  if (isRecording || isProcessing) return;
  isRecording = true;
  audioChunks = [];
  speechBubble.classList.remove('visible');

  const s = await getStream();
  mediaRecorder = new MediaRecorder(s, { mimeType: 'audio/webm;codecs=opus' });
  mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
  mediaRecorder.start(100);
  setStatus('recording', 'listening...');
}

async function stopRecording() {
  if (!isRecording || !mediaRecorder) return;
  isRecording = false;

  await new Promise((resolve) => {
    mediaRecorder.onstop = resolve;
    mediaRecorder.stop();
  });

  const blob = new Blob(audioChunks, { type: 'audio/webm' });
  if (blob.size < 1000) {
    setStatus('idle', 'hold space');
    return;
  }

  isProcessing = true;
  setStatus('thinking', 'transcribing...');

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const transcript = await window.shravs.transcribe(arrayBuffer);

    if (!transcript) {
      setStatus('idle', 'hold space');
      isProcessing = false;
      return;
    }

    setStatus('thinking', 'thinking...');
    const reply = await window.shravs.chat(transcript);
    showBubble(reply);

    setStatus('speaking', 'speaking...');
    await speak(reply);

    setStatus('idle', 'hold space');
    hideBubble(8000);
  } catch (err) {
    console.error(err);
    showBubble('something broke. try again.');
    hideBubble(4000);
    setStatus('idle', 'hold space');
  }

  isProcessing = false;
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.repeat) { e.preventDefault(); startRecording(); }
});
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') { e.preventDefault(); stopRecording(); }
});

// Show initial bubble after a beat
setTimeout(() => { showBubble('hey. what do you want.'); hideBubble(4000); }, 800);
