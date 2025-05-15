const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('chatbot_app', {
  update_css_settings: (obj) => ipcRenderer.invoke('update_css_settings', obj),
  get_bot_data: () => ipcRenderer.invoke('get_bot_data')
})