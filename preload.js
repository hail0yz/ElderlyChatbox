const { contextBridge, ipcRenderer } = require('electron')

console.log('PL');

contextBridge.exposeInMainWorld('chatbot_app', {
  update_css_settings: () => ipcRenderer.invoke('update_css_settings')
})