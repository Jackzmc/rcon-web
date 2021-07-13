import Database  from '../database.js'
import { Router } from 'express'
import { ErrorCode } from '../util';
import { Express } from 'express'

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
  return router
}

