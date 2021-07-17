import Database  from '../internal/database.js'
import { Router } from 'express'
import { ErrorCode, checkParameters, requireAuth } from '../util';
import { Express } from 'express'
import Server from '../entity/Server';
import ServerController from '../internal/ServerInstanceController.js';

const router = Router()

export default function(controller: ServerController) {
  router.get('/', requireAuth, async(req, res) => {
    const user = await controller.db.Users.findOneOrFail(req.session.user.id, { relations: ['servers', 'permissions'] })
    if (req.query.full) {
      const owned = [], shared = []
      for(const server of user.servers) {
        owned.push({
          ...server,
          owned: true,
          sharedWith: [], //TODO: fixme
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
      ...controller.app.locals.error(ErrorCode.MISSING_PARAMS),
      query: {
        "servers": "Comma list of servers to check"
      }
    })
    const user = await controller.db.Users.findOneOrFail(req.session.user.id, { relations: ['servers', 'permissions']})

    const ids: string[] = (req.query.servers as string).split(",")
    const servers = []
    for(const id in ids) {
      const server = await controller.db.Servers.findOne(id)
      if(server.hasPermission(user)) {
        servers.push({
          ...server,
          details: await server.details()
        })
      }
    }
    res.json(servers)
  })

  router.get('/:id/logs', requireAuth, async(req, res) => {
    const server = await controller.db.Servers.findOne(req.params.id)
    if(server) {
      const instance = controller.getInstance(server)
      if(!instance) return res.status(500).json(controller.app.locals.error(ErrorCode.INTERNAL_SERVER_ERROR, "Could not server instance"))
      res.json({
        lastMessageRecieved: instance.lastLineTimestamp,
        lines: instance.logs
      })
    }
    else res.status(404).json(controller.app.locals.error(ErrorCode.SERVER_NOT_FOUND))
  })

  router.get('/:id/console', requireAuth, async(req, res) => {
    const server = await controller.db.Servers.findOne(req.params.id)
    if(server) {
      const instance = controller.getInstance(server)
      if(!instance) return res.status(500).json(controller.app.locals.error(ErrorCode.INTERNAL_SERVER_ERROR, "Could not server instance"))
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
      });
      res.flushHeaders();
      if(!instance.consoleAvailable) {
        res.write('data: Console logging is unavailable for this server.\n\nevent: close\ndata: CONSOLE_UNAVAILABLE\n\n')
        return
      }

      res.write('retry: 10000\n\n');

      const index = instance.addStreamConnection(res)
      res.on('close', () => {
        console.log('connection closed, closing stream connection #', index)
        instance.removeStreamConnection(index)
      })
    }
    else res.status(404).json(controller.app.locals.error(ErrorCode.SERVER_NOT_FOUND))
  })

  router.post('/:id/command', requireAuth, async(req, res) => {
    //TODO: Implement rcon 
    const user = await controller.db.Users.findOneOrFail(req.session.user.id)
    const server = await controller.db.Servers.findOne(req.params.id)
    if(server) {
      const instance = controller.getInstance(server)
      if(!instance) return res.status(500).json(controller.app.locals.error(ErrorCode.INTERNAL_SERVER_ERROR, "Could not server instance"))
      try {
        const response = await instance.sendCommand(req.body, user)
        res.send(response)
      } catch(err) {
        res.status(500).json(controller.app.locals.error(ErrorCode.RCON_UNAVAILABLE))
      }
    }
    else res.status(404).json(controller.app.locals.error(ErrorCode.SERVER_NOT_FOUND))
  })

  router.post('/', requireAuth, checkParameters([
    "name",
    "directory",
    "ip",
    "port"
  ]), async(req, res) => {
    //Fetch all servers with the IP and port
    const existingServers = await controller.db.Servers.findAndCount({
      where: {
        ip: req.body.ip,
        port: req.body.port
      },
    })

    //Check for any pre-existing server IP:Port combos
    if(existingServers.length > 0) {
      return res.json(controller.app.locals.error(ErrorCode.SERVER_ALREADY_EXISTS))
    }

    //If no server exists, create a new one
    const server = controller.db.Servers.create({
      id: await Server.generateID(),
      directory: req.body.directory,
      name: req.body.name,
      port: req.body.port,
      ip: req.body.ip,
      owner: controller.db.Users.findOneOrFail(req.session.user.id)
    })

    await controller.db.Servers.save(server)

    res.json({
      result: 'SUCCESS',
      id: server.id
    })
  })

  router.get('/:id', requireAuth, async(req, res) => {
    const server = await controller.db.Servers.findOne(req.params.id)
    if(server) {
      return res.json({
        ...server,
        status: await server.details()
      })
    }
    else res.status(404).json(controller.app.locals.error(ErrorCode.SERVER_NOT_FOUND))
  })

  return router
}

