import express from 'express'
import dotenv from 'dotenv'
import Database from './database'
dotenv.config()

const WEB_PORT = process.env.WEB_PORT || 8080
const app = express()

const db = new Database()

import { generateError } from './util'
import Servers from './routes/servers'

db.init()
.then(() => {
  app.locals.error = generateError
  app.use('/api/servers', Servers(app, db))


  app.listen(WEB_PORT, () => {
    console.info('[Server] Listening on :' + WEB_PORT)
  })

})
