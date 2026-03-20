const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('widgetAPI', {
fechar : () => ipcRenderer.send('fechar-janela'),
    maximizar : () => ipcRenderer.send('maximizar-janela'),
    minimizar : () => ipcRenderer.send('minimizar-janela'),
    iniciarSessao : () => ipcRenderer.invoke('iniciar-foco'),
    pararSessao : () => ipcRenderer.invoke('parar-foco'),
    onMudancaEnergia : (callback) => ipcRenderer.on('alerta-energia', callback)
})

contextBridge.exposeInMainWorld('notifyAPI', {
    send: (title, body) => ipcRenderer.send('show-notification', { title, body }),
    playSound: () => {
      const audio = new Audio('../assets/sound/notification.wav')
      audio.play()
    }
  })
  