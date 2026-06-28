const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('shravs', {
  transcribe: (audioBuffer) => ipcRenderer.invoke('transcribe', audioBuffer),
  chat: (text) => ipcRenderer.invoke('chat', text),
  speak: (text) => ipcRenderer.invoke('speak', text),
});
