const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('chatbot_app', {
  update_css_settings: (obj) => ipcRenderer.invoke('update_css_settings', obj),
  get_settings: () => ipcRenderer.invoke('get_settings'),
  set_settings: (obj) => ipcRenderer.invoke('set_settings', obj),
  get_bot_data: () => ipcRenderer.invoke('get_bot_data'),
  set_bot_data: (obj) => ipcRenderer.invoke('set_bot_data', obj),
  get_form_data: () => ipcRenderer.invoke('get_form_data'),
  set_form_data: (obj) => ipcRenderer.invoke('set_form_data', obj),
  get_disponible_settings: () => ipcRenderer.invoke('get_disponible_settings'),
  set_bot_data: (obj) => ipcRenderer.invoke('set_bot_data', obj),
  get_notif_data: () => ipcRenderer.invoke('get_notif_data'),
  set_notif_data: (obj) => ipcRenderer.invoke('set_notif_data', obj)
})