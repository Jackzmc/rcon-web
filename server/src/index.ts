import express from 'express'
import dotenv from 'dotenv'
import Database from './database'
import "reflect-metadata"
import Session from 'express-session'
import Cors from 'cors'
import { TypeormStore } from 'typeorm-store';

dotenv.config()

const WEB_PORT = process.env.WEB_PORT || 8080
const app = express()

import { generateError } from './util'
import Servers from './routes/servers'
import Auth from './routes/auth'

app.locals.error = generateError
app.use(express.json())

if(process.env.NODE_ENV === "production") {
  app.set('trust proxy', 1)
}


new Database().init()
.then(db => {
  //Setup sessions
  app.use(Session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { path: '/', httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: null, sameSite: true },
    store: new TypeormStore({ repository: db.Sessions })
    //TODO: implement mysql store store: process.env.NODE_ENV === "production" ?
  }))
  //Setup cors for a list of domains
  const domains = process.env.CORS_DOMAINS ? process.env.CORS_DOMAINS.split(",") : []
  app.use(Cors({
    origin: (origin: string, callback: Function) => {
      if(domains.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }))
  app.use('/api/auth', Auth(app, db))
  app.use('/api/servers', Servers(app, db))

  app.listen(WEB_PORT, () => {
    console.info('[Server] Listening on :' + WEB_PORT)
  })

})
