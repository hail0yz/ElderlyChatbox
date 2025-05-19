const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('chatbot_app', {
  update_css_settings: (obj) => ipcRenderer.invoke('update_css_settings', obj),
  get_bot_data: () => ipcRenderer.invoke('get_bot_data'),
  get_disponible_settings: () => ipcRenderer.invoke('get_disponible_settings'),
  set_bot_data: (obj) => ipcRenderer.invoke('set_bot_data', obj)
})