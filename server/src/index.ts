import express from 'express'
import dotenv from 'dotenv'
import Database from './internal/database'
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
import ServerController from './internal/ServerInstanceController';

app.locals.error = generateError
app.use(express.json())

if(process.env.NODE_ENV === "production") {
  app.set('trust proxy', 1)
}


new Database().init()
.then(db => {
  const controller = new ServerController(app, db)

  //Setup sessions
  app.use(Session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { path: '/', httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: null, sameSite: true },
    name: 'rconweb',
    store: new TypeormStore({ repository: db.Sessions })
    //TODO: implement mysql store store: process.env.NODE_ENV === "production" ?
  }))
  //Setup cors for a list of domains
  const domains = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []
  app.use(Cors({
    origin: (origin: string, callback: Function) => {
      if(domains.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    },
    methods: "GET, PUT, POST, DELETE"
  }))
  app.use('/api/auth', Auth(controller))
  app.use('/api/servers', Servers(controller))

  app.listen(WEB_PORT, () => {
    console.info('[Server] Listening on :' + WEB_PORT)
  })

})

setInterval(() => {
  console.log("example message", Date.now())
}, 10000)
