import { ipcMain } from 'electron'
import {
  createSession,
  updateSession,
  completeSession,
  stopSession,
  cancelSession,
  listSessions,
  deleteSession,
  createTimestamp,
  completeTimestamp,
  listTimestamps,
  deleteTimestamp,
  getHistoryFromDb,
  getDbSettings,
  setDbSettings,
  getCalendarNotes,
  setCalendarNote,
  deleteCalendarNote
} from './crud.js'
import { isDbAvailable } from './database.js'

function wrap(fn) {
  return async (_, ...args) => {
    try {
      const result = await fn(...args)
      return { ok: true, data: result }
    } catch (err) {
      console.error('[DB IPC]', err.message)
      return { ok: false, error: err.message }
    }
  }
}

export function registerDatabaseHandlers() {
  ipcMain.handle('db:available', () => isDbAvailable())

  ipcMain.handle('db:session:create', wrap(createSession))
  ipcMain.handle('db:session:update', wrap(updateSession))
  ipcMain.handle('db:session:complete', wrap(completeSession))
  ipcMain.handle('db:session:stop', wrap(stopSession))
  ipcMain.handle('db:session:cancel', wrap(cancelSession))
  ipcMain.handle('db:session:list', wrap(listSessions))
  ipcMain.handle('db:session:delete', wrap(deleteSession))

  ipcMain.handle('db:timestamp:create', wrap(createTimestamp))
  ipcMain.handle('db:timestamp:complete', wrap(completeTimestamp))
  ipcMain.handle('db:timestamp:list', wrap(listTimestamps))
  ipcMain.handle('db:timestamp:delete', wrap(deleteTimestamp))

  ipcMain.handle('db:history:get', wrap(getHistoryFromDb))

  ipcMain.handle('db:settings:get', wrap(getDbSettings))
  ipcMain.handle('db:settings:set', wrap(setDbSettings))

  ipcMain.handle('db:calendar:get', wrap(getCalendarNotes))
  ipcMain.handle('db:calendar:set', wrap(setCalendarNote))
  ipcMain.handle('db:calendar:delete', wrap(deleteCalendarNote))
}
