const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require("node:path");
const { update_css_settings } = require("./settings/updateRootCSS")

Menu.setApplicationMenu(false)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname,"preload.js")
    }
  })

  win.loadFile('./menu/menu.html')
}

app.whenReady().then(() => {
  ipcMain.handle('update_css_settings', () => {
    update_css_settings(__dirname);
  })
  createWindow()
})