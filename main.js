const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require("node:path");
const { update_css_settings } = require("./settings/updateRootCSS")
const { getData, setData } = require('./settings/chatbot_data')
const { getDS } = require('./settings/disponible_settings')
const { getFormData, setFormData } = require('./settings/form_data/form_data')

let cachedFormData = null;
let formDone = false;
const { getNotifData, setNotifData } = require('./settings/notif_data')

Menu.setApplicationMenu(false)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname,"preload.js")
    }
  })

  win.webContents.openDevTools()
  if(formDone) {
    win.loadFile('./menu/menu.html')
  }else {
    win.loadFile('./conseilsPerso/formulaire.html')
  }
}

app.whenReady().then(() => {
  ipcMain.handle('update_css_settings', (_, obj) => {
    update_css_settings(__dirname, obj);
  })
  ipcMain.handle('get_bot_data', () => {
    return getData(__dirname);
  })
  ipcMain.handle('set_bot_data', (_, obj) => {
    setData(__dirname, obj);
  })
  createWindow()
})