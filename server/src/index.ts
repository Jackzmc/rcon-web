import express from 'express'
import dotenv from 'dotenv'
import Database from './database'
import "reflect-metadata"
dotenv.config()

const WEB_PORT = process.env.WEB_PORT || 8080
const app = express()

import { generateError } from './util'
import Servers from './routes/servers'

app.locals.error = generateError
app.use(express.json())

new Database().init()
.then(db => {
  app.use('/api/servers', Servers(app, db))

  app.listen(WEB_PORT, () => {
    console.info('[Server] Listening on :' + WEB_PORT)
  })

})
