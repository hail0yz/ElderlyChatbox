const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require("node:path");
const { update_css_settings, set_Setting, get_Setting } = require("./settings/updateRootCSS")
const { getData, setData } = require('./settings/chatbot_data')
const { getDS } = require('./settings/disponible_settings')
const { getFormData, setFormData } = require('./settings/form_data/form_data')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { spawn } = require('child_process');
let llmProcess = null;

let cachedFormData = null;
let formDone = false;
const { getNotifData, setNotifData } = require('./settings/notif_data')

Menu.setApplicationMenu(null)

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

app.on('window-all-closed', () => {
  stopLLM();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  cachedFormData = getFormData(__dirname);
  if (cachedFormData === null) {
    cachedFormData = {
      answers: {},
      done: false
    };
  }
  formDone = cachedFormData.done;
  
  startLLM();
  createWindow();
  init_icp_handler();
})

function startLLM() {
  const ollamaPath = path.join(__dirname, 'ollama/ollama');
  
  llmProcess = spawn(ollamaPath, ['run', 'llama3.2:1b'], {
    env: process.env,
    cwd: __dirname,
    detached: true,
    stdio: 'ignore',
  });
  
  llmProcess.unref();
}

function stopLLM() {
  const ollamaPath = path.join(__dirname, 'ollama');
  spawn(ollamaPath, ['stop', 'llama3.2:1b'], {
    env: process.env,
    cwd: __dirname,
  });
}

function init_icp_handler() {
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
  ipcMain.handle('set_settings', (_, obj) => {
    set_Setting(__dirname, obj);
  })
  ipcMain.handle('get_settings', () => {
    return get_Setting(__dirname);
  })
  ipcMain.handle('send_message', async (_, msg)=> {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:1b',
          prompt: msg,
          stream: false
        })
      });
      
      const data = await response.json();
      return data.response; // contient le texte du modèle
    } catch (err) {
      console.error("Erreur lors de l'appel à Ollama :", err);
      return "Erreur : impossible de contacter le modèle.";
    }
  });
}