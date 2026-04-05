import { Sequelize } from 'sequelize'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
let _sequelize = null
let _available = false

export async function initDatabase() {
  const database = import.meta.env.VITE_DATABASE_PG
  const username = import.meta.env.VITE_USER_PG
  const password = import.meta.env.VITE_PASS_PG
  const host = import.meta.env.VITE_HOST_PG
  const port = import.meta.env.VITE_PORT_PG
  const pem = app.isPackaged
    ? path.join(process.resourcesPath, 'pem/global-bundle.pem')
    : path.join(__dirname, '../../src/pem/global-bundle.pem')

  if (!database || !username || !host) {
    console.log('[DB] Missing credentials — falling back to localStorage')
    return false
  }

  const sslOptions = { require: true, rejectUnauthorized: false }
  if (fs.existsSync(pem)) {
    sslOptions.ca = fs.readFileSync(pem).toString()
  } else {
    console.log('[DB] PEM not found at', pem, '— connecting with SSL but without CA cert')
  }

  const options = {
    host,
    port: Number(port) || 5432,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    dialectOptions: { ssl: sslOptions }
  }

  try {
    _sequelize = new Sequelize(database, username, password, options)
    await _sequelize.authenticate()
    _available = true
    console.log('[DB] Connected to PostgreSQL')
    return true
  } catch (err) {
    console.warn('[DB] Connection failed — falling back to localStorage:', err.message)
    _sequelize = null
    return false
  }
}

export function getSequelize() {
  return _sequelize
}

export function isDbAvailable() {
  return _available
}
