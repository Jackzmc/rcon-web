import Database  from '../database.js'
import { Router } from 'express'
import { ErrorCode, checkParameters, requireAuth } from '../util';
import { Express } from 'express'
import User from '../entity/User';

const router = Router()

export default function(app: Express, db: Database) {
  router.post('/login', checkParameters([
    "username",
    "password"
  ]), async(req, res) => {
    const user = await db.Users.findOne({
      select: ['id', 'email', 'username', 'lastLogin', 'password'],
      relations: ['servers', 'permissions'],
      where: [
        { username: req.body.username },
        { email: req.body.username }
      ]
    })

    if(!user) {
      //TODO: Add new errorcode, use invalid user/pass for msg
      return res.status(400).json(app.locals.error(ErrorCode.UNAUTHORIZED, "User does not exist"))
    }

    if(await user.login(req.body.password)) {
      req.session.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        lastLogin: user.lastLogin,
        sessionCreated: new Date()
      }
      res.send()
    } else {
      return res.status(400).json(app.locals.error(ErrorCode.UNAUTHORIZED, "Invalid username or password"))
    }
  })

  return router
}

