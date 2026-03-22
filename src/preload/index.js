import { contextBridge, ipcRenderer } from 'electron'

const apiPomodoro = {
  fechar: () => ipcRenderer.send('fechar-janela'),
  maximizar: () => ipcRenderer.send('maximizar-janela'),
  minimizar: () => ipcRenderer.send('minimizar-janela'),
  iniciarSessao: () => ipcRenderer.invoke('iniciar-foco'),
  pararSessao: () => ipcRenderer.invoke('parar-foco'),
  onMudancaEnergia: (callback) => ipcRenderer.on('alerta-energia', callback)
}

const apiNotify = {
  send: (title, body) => ipcRenderer.send('show-notification', { title, body }),
  playSound: () => ipcRenderer.send('play-sound')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('widgetAPI', apiPomodoro)
    contextBridge.exposeInMainWorld('notifyAPI', apiNotify)
  } catch (error) {
    console.error(error)
  }
} else {
  window.widgetAPI = apiPomodoro
  window.notifyAPI = apiNotify
}
