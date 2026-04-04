import { Sequelize } from 'sequelize'
import pg from 'pg'
import fs from 'fs'

let _sequelize = null
let _available = false

export async function initDatabase() {
  const database = process.env.DATABASE_PG
  const username = process.env.USER_PG
  const password = process.env.PASS_PG
  const host = process.env.HOST_PG
  const port = process.env.PORT_PG
  const pem = process.env.PEM

  if (!database || !username || !host) {
    console.log('[DB] Missing credentials — falling back to localStorage')
    return false
  }

  const options = {
    host,
    port: Number(port) || 5432,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false
  }

  if (pem && fs.existsSync(pem)) {
    options.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: fs.readFileSync(pem).toString()
      }
    }
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
