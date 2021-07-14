import Database  from '../database.js'
import { Router } from 'express'
import { ErrorCode, checkParameters, requireAuth } from '../util';
import { Express } from 'express'
import Server from '../entity/Server';

const router = Router()

export default function(app: Express, db: Database) {
  router.get('/:id', requireAuth, async(req, res) => {
    const server = await db.Servers.findOne(req.params.id)
    if(server) {
      return res.json({
        ...server,
        status: await server.details()
      })
    }
    else res.status(404).json(app.locals.error(ErrorCode.SERVER_NOT_FOUND))
  })

  router.get('/', requireAuth, async(req, res) => {
    const user = await db.Users.findOneOrFail(req.session.user.id, { relations: ['servers', 'permissions']})
    res.json({
      owned: user.servers,
      shared: user.permissions.map(permissions => permissions.server)
    })
  })

  //TODO: Query shit
  router.get('/details', requireAuth, async(req, res) => {
    // res.json(result.map(server => {
    //   return {
    //     ...server,
    //     players: [],
    //     status: true
    //   }
    // }))
  })

  router.post('/', requireAuth, checkParameters([
    "name",
    "directory",
    "ip",
    "port"
  ]), async(req, res) => {
    //Fetch all servers with the IP and port
    const existingServers = await db.Servers.findAndCount({
      where: {
        ip: req.body.ip,
        port: req.body.port
      },
    })

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
      ip: req.body.ip,
      owner: db.Users.findOneOrFail(req.session.user.id)
    })

    await db.Servers.save(server)

    res.json({
      result: 'SUCCESS',
      id: server.id
    })
  })

  return router
}

