const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
const path = require("node:path");
const { update_css_settings, set_Setting, get_Setting } = require("./settings/updateRootCSS")
const { getData, setData } = require('./settings/chatbot_data')
const { getDS } = require('./settings/disponible_settings')
const { getFormData, setFormData } = require('./settings/form_data/form_data')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { dialog } = require('electron');
const os = require('os');
const fs = require('fs');

const { spawn, execSync } = require('child_process');
let llmProcess = null;

let cachedFormData = null;
let formDone = false;
const { getNotifData, setNotifData } = require('./settings/notif_data');
const { exit } = require('node:process');

Menu.setApplicationMenu(null)

const MODEL_NAME = /*'llama3.2:1b'*/ 'gemma3:1b';

const isWin = os.platform() === 'win32';
const ollamaPath = isWin ? 
path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Ollama', 'ollama app.exe'): 
path.join(__dirname, 'ollama/ollama');

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
    win.loadFile('./profile/formulaire.html')
  }
}

app.on('window-all-closed', () => {
  stopLLM();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(async () => {
  await verifit_si_le_model_est_installe();
  
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

async function verifit_si_le_model_est_installe() {
  
  if (isWin && !fs.existsSync(ollamaPath)) {
    const setupPath = path.join(__dirname, 'ollama', 'OllamaSetup.exe');
    
    await new Promise((resolve, reject) => {
      const installer = spawn(setupPath, {
        stdio: 'ignore',
        windowsHide: true
      });
      
      installer.on('close', (code) => { resolve(); });
      installer.on('error', reject);
    });
    
    dialog.showMessageBoxSync({
      type: 'info',
      buttons: ['OK'],
      title: 'Installation requise',
      message: 'Ollama n\'est pas installé.\n\nL\'installateur vient d\'être lancé.\nVeuillez suivre les instructions, puis redémarrez l\'application une fois l\'installation terminée.',
    });
    
    exit(0);
  }
  
  try {
    const listOutput = execSync(`"${ollamaPath}" list`).toString();
    if (!listOutput.includes(MODEL_NAME)) {
      console.log(`Modèle ${MODEL_NAME} non trouvé, téléchargement en cours...`);
      execSync(`"${ollamaPath}" pull ${MODEL_NAME}`, { stdio: 'inherit' });
      console.log(`Modèle ${MODEL_NAME} téléchargé avec succès.`);
    } else {
      console.log(`Modèle ${MODEL_NAME} déjà installé.`);
    }
  } catch (err) {
    console.error("Erreur lors de la vérification ou du téléchargement du modèle :", err);
  }
}

function startLLM() {
  llmProcess = spawn(ollamaPath, ['serve'], {
    env: process.env,
    cwd: __dirname,
    detached: true,
    stdio: 'ignore',
  });
  
  llmProcess.unref();
}

function stopLLM() {
  try {
    execSync(`${ollamaPath} stop`, { stdio: 'ignore' });
    console.log("Serveur Ollama arrêté.");
  } catch (err) {
    console.warn("Erreur lors de l'arrêt du serveur Ollama (peut être déjà arrêté) :", err.message);
  }
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
          model: MODEL_NAME,
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
  })
 
  //Lancer le window notfications en fond pour avoir les notifications
  const win = new BrowserWindow({
      show: false,
      webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      }
  });

  win.loadFile('./notifications/notifications.html');

  ipcMain.handle('close-all-windows', () => {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((win) => win.close());
  });

}