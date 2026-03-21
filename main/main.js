const { app, BrowserWindow, ipcMain, powerMonitor, powerSaveBlocker, Notification } = require('electron');
const path = require('path')

let mainWindow;
let bloqueadorFocoId = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        transparent: true,
        resizable : true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        },
        icon: path.join(__dirname, "../assets/icon.png")
    });
        mainWindow.loadFile(path.join(__dirname, `../renderer/index.html`));
};

app.whenReady().then(() => {
    createWindow();

    powerMonitor.on('on-battery', () => {
        mainWindow.webContents.send('alerta-energia', 'bateria')
    })

    powerMonitor.on('on-ac', () => {
        mainWindow.webContents.send('alerta-energia', 'tomada')
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

ipcMain.on('fechar-janela', () => {
    if(mainWindow) mainWindow.close()
})

ipcMain.on('minimizar-janela', () => {
    if(mainWindow) mainWindow.minimize()
})

ipcMain.on('maximizar-janela', () => {
    if(mainWindow){
        if(mainWindow.isMaximized()){
            mainWindow.unmaximize()
        } else {
            mainWindow.maximize()
        }
    }
})

ipcMain.handle('iniciar-foco', () => {
    if(bloqueadorFocoId === null){
        bloqueadorFocoId = powerSaveBlocker.start('prevent-app-suspension')
        return true
    }
    return false
})

ipcMain.handle('parar-foco', () => {
    if(bloqueadorFocoId !== null && powerSaveBlocker.isStarted(bloqueadorFocoId)){
        powerSaveBlocker.stop(bloqueadorFocoId)
        bloqueadorFocoId = null
        return true
    }
    return false
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('show-notification', (event, { title, body }) => {
    new Notification({ title, body }).show()
  })