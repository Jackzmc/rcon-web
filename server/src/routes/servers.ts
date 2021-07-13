import Database  from '../database.js'
import { Router } from 'express'

const router = Router()

export default function(db: Database) {
  router.get('/:id', async(req, res) => {

  })
  router.get('/', async(req, res) => {
    const servers = await db.Servers.find()
    console.log(servers)
    res.json(servers)
  })
  return router
}

