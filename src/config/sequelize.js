import { Sequelize } from 'sequelize'
import { S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'
import pg from 'pg'
const client = new S3Client({ region: 'us-east-1' })

const database = process.env.DATABASE_PG
const username = process.env.USER_PG
const password = process.env.PASS_PG
const host = process.env.HOST_PG
const port = process.env.PORT_PG
const pem = process.env.PEM

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: Number(port),
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnathorized: false,
      ca: fs.readFileSync(pem).toString()
    }
  },
  logging: false
})

export default sequelize
