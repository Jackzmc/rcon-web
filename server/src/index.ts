import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const WEB_PORT = process.env.WEB_PORT || 8080
const app = express()
app.listen(WEB_PORT, () => {
  console.info('[Server] Listening on :' + WEB_PORT)
})
