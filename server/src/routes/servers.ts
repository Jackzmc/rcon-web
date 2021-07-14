import Database  from '../database.js'
import { Router } from 'express'
import { ErrorCode, checkParameters, requireAuth } from '../util';
import { Express } from 'express'
import Server from '../entity/Server';

const router = Router()

export default function(app: Express, db: Database) {
  router.get('/', requireAuth, async(req, res) => {
    const user = await db.Users.findOneOrFail(req.session.user.id, { relations: ['servers', 'permissions']})
    if (req.query.full) {
      const owned = [], shared = []
      for(const server of user.servers) {
        owned.push({
          ...server,
          owned: true,
          details: await server.details()
        })
      }

      for(const permission of user.permissions) {
        shared.push({
          ...permission.server,
          owned: false,
          permissions: permission.flags,
          details: await permission.server.details()
        })
      }

      res.json({
        owned,
        shared
      })
    } else {
      res.json({
        owned: user.servers
          .map(server => {
            return { ...server, owned: true }
          }),
        shared: user.permissions
          .map(permissions => permissions.server)
          .map(server => {
            return { ...server, owned: false }
          }),
      })
    }
  })

  //TODO: Query shit
  router.get('/details', requireAuth, async(req, res) => {
    if(!req.query.servers) return res.status(400).json({
      ...app.locals.error(ErrorCode.MISSING_PARAMS),
      query: {
        "servers": "Comma list of servers to check"
      }
    })
    const user = await db.Users.findOneOrFail(req.session.user.id, { relations: ['servers', 'permissions']})

    const ids: string[] = (req.query.servers as string).split(",")
    const servers = []
    for(const id in ids) {
      const server = await db.Servers.findOne(id)
      if(server.hasPermission(user)) {
        servers.push({
          ...server,
          details: await server.details()
        })
      }
    }
    res.json(servers)
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

  return router
}

