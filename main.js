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
  ipcMain.handle('get_disponible_settings', () => {
    return getDS(__dirname);
  })
  ipcMain.handle('get_form_data', () => {
    return getFormData(__dirname);
  })
  ipcMain.handle('set_form_data', (_, obj) => {
    console.log("SAVING FOR :", obj.f);
    setFormData(__dirname, obj);
  })
  ipcMain.handle('get_notif_data', () => {
    return getNotifData(__dirname);
  })
  ipcMain.handle('set_notif_data', (_, obj) => {
    setNotifData(__dirname, obj);
  })
  cachedFormData = getFormData(__dirname);
  if (cachedFormData === null) {
    cachedFormData = {
      answers: {},
      done: false
    };
  }
  formDone = cachedFormData.done;
  createWindow()
})