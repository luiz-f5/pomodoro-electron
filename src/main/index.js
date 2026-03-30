import {
  app,
  BrowserWindow,
  ipcMain,
  powerMonitor,
  powerSaveBlocker,
  Notification,
  Tray,
  Menu,
  nativeImage
} from 'electron'

import { join } from 'path'
import { spawn } from 'child_process'
import icon from '../../resources/icon.png?asset'

let mainWindow
let bloqueadorFocoId = null
let tray = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    transparent: true,
    resizable: true,
    icon: nativeImage.createFromPath(icon),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(() => {
  createWindow()

  tray = new Tray(nativeImage.createFromPath(icon))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Minimizar',
      type: 'radio',
      click: () => mainWindow.minimize()
    },
    {
      label: 'Maximizar',
      type: 'radio',
      click: () => {
        if (mainWindow) {
          if (mainWindow.isMaximized()) {
            mainWindow.unmaximize()
          } else {
            mainWindow.maximize()
          }
        }
      }
    },
    { label: 'Fechar', type: 'radio', click: () => mainWindow.close() }
  ])
  tray.setContextMenu(contextMenu)

  powerMonitor.on('on-battery', () => {
    mainWindow.webContents.send('alerta-energia', 'bateria')
  })

  powerMonitor.on('on-ac', () => {
    mainWindow.webContents.send('alerta-energia', 'tomada')
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.on('fechar-janela', () => {
  if (mainWindow) mainWindow.close()
})

ipcMain.on('minimizar-janela', () => {
  if (mainWindow) mainWindow.minimize()
})

ipcMain.on('maximizar-janela', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

ipcMain.handle('iniciar-foco', () => {
  if (bloqueadorFocoId === null) {
    bloqueadorFocoId = powerSaveBlocker.start('prevent-app-suspension')
    return true
  }
  return false
})

ipcMain.handle('parar-foco', () => {
  if (bloqueadorFocoId !== null && powerSaveBlocker.isStarted(bloqueadorFocoId)) {
    powerSaveBlocker.stop(bloqueadorFocoId)
    bloqueadorFocoId = null
    return true
  }
  return false
})

ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show()
})

ipcMain.on('play-sound', () => {
  if (process.platform === 'linux') {
    const canberra = spawn('canberra-gtk-play', ['--id=message', '--description=Pomodoro'])
    canberra.on('error', () => {
      spawn('paplay', ['/usr/share/sounds/freedesktop/stereo/message.oga']).on('error', () => {
        spawn('aplay', ['/usr/share/sounds/alsa/Noise.wav'])
      })
    })
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
