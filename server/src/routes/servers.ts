import Database  from '../database.js'
import { Router } from 'express'
import { ErrorCode, checkParameters } from '../util';
import { Express } from 'express'
import { Server } from '../entity/Server';

const router = Router()

export default function(app: Express, db: Database) {
  router.get('/:id', async(req, res) => {
    const result = await db.Servers.findOne(req.params.id)
    if(result) res.json({
      ...result,
      players: [],
      status: true
    })
    else res.status(404).json(app.locals.error(ErrorCode.SERVER_NOT_FOUND))
  })

  router.get('/', async(req, res) => {
    const result = await db.Servers.find()
    res.json(result.map(server => {
      return {
        ...server,
        players: [],
        status: true
      }
    }))
  })

  router.post('/', checkParameters([
    "name",
    "directory",
    "ip",
    "port"
  ]), async(req, res) => {
    //Fetch all servers with the IP and port
    const existingServers = await db.Servers.findAndCount({ where: {
      ip: req.body.ip,
      port: req.body.port
    }})

    //Check for any pre-existing server IP:Port combos
    if(existingServers.length > 0) {
      return res.json(app.locals.error(ErrorCode.SERVER_ALREADY_EXISTS))
    }

    //If no server exists, create a new one
    const server = db.Servers.create({
      id: await Server.generateID(),
      directory: req.body.directory,
      name: req.body.name,
      port: req.body.port,
      ip: req.body.ip
    })

    await db.Servers.save(server)

    res.json({
      result: 'SUCCESS',
      id: server.id
    })
  })

  return router
}

