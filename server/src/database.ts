import mysql from 'mysql2/promise'

export default class Database {
  private connection: mysql.Connection = null

  constructor() {

  }

  async init() {
    try {
      const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USERNAME || 'root',
        database: process.env.MYSQL_DB || 'rcon-web',
        password: process.env.MYSQL_PASSWORD || ''
      })
      this.connection = connection
      console.info(`[DB] Connected to ${process.env.MYSQL_DB || 'rcon-web'} successfully`)
      return true
    } catch(err) {
      console.error('[DB] Could not connect to database, terminating', err)
      process.exit(1)
      return false
    }
  }

  get ready() {
    return !!this.connection
  }

  servers() {
    const _this = this
    return {
      async fetchAll() {
        const [data] = await _this.connection.execute("SELECT * FROM servers")
        return data
      }
    }
  }
}


//db.servers().
