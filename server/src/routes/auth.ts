import Database  from '../internal/database.js'
import { Router } from 'express'
import { ErrorCode, checkParameters, requireAuth } from '../util';
import { Express } from 'express'
import User from '../entity/User';
import ServerController from '../internal/ServerInstanceController';

const router = Router()

export default function(controller: ServerController) {
  router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  router.post('/login', checkParameters([
    "username",
    "password"
  ]), async(req, res) => {
    const user = await controller.db.Users.findOne({
      select: ['id', 'email', 'username', 'lastLogin', 'password'],
      relations: ['servers', 'permissions'],
      where: [
        { username: req.body.username },
        { email: req.body.username }
      ]
    })

    if(!user) {
      //TODO: Add new errorcode, use invalid user/pass for msg
      return res.status(400).json(controller.app.locals.error(ErrorCode.UNAUTHORIZED, "User does not exist"))
    }

    if(await user.login(req.body.password)) {
      delete user.password
      req.session.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        lastLogin: user.lastLogin,
        sessionCreated: new Date()
      }
      res.json({
        user: req.session.user,
        sessionId: req.sessionID
      })
    } else {
      return res.status(400).json(controller.app.locals.error(ErrorCode.UNAUTHORIZED, "Invalid username or password"))
    }
  })

  //Check if session is valid
  router.get('/session', requireAuth, async(req, res) => {
    res.json({
      user: req.session.user,
      sessionId: req.sessionID
    })
  })

  return router
}

