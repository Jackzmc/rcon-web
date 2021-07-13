import Database  from '../database.js'
import { Router } from 'express'

const router = Router()

export default function(db: Database) {
  router.get('/:id', async(req, res) => {

  })
  router.get('/', async(req, res) => {
    if(db.ready) {
      const servers = await db.servers().fetchAll()
      console.log(servers)
      res.json(servers)
    } else {
      res.json({
        error: 'not ready'
      })
    }
  })
  return router
}

