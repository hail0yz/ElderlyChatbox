import { ChatGroq } from "@langchain/groq";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require("node:path");
const { update_css_settings } = require("./settings/updateRootCSS")
const { getData, setData } = require('./settings/chatbot_data')
GROQ_API_KEY="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";
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
  win.loadFile('./menu/menu.html')
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

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});