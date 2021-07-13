import "reflect-metadata";
import { createConnection, Connection, Repository } from "typeorm";

import { Server } from './entity/Server'

export default class Database {
  #connection: Connection = null
  #Servers: Repository<Server>

  constructor() {

  }

  async init() {
    try {
      const connection = await createConnection({
        type: "mysql",
        host: process.env.MYSQL_HOST || 'localhost',
        username: process.env.MYSQL_USERNAME || 'root',
        database: process.env.MYSQL_DB || 'rcon-web',
        password: process.env.MYSQL_PASSWORD || '',
        entities: [
          Server
        ],
        synchronize: true,
      })
      this.#connection = connection
      console.info(`[DB] Connected to ${process.env.MYSQL_DB || 'rcon-web'} successfully`)
      return connection
    } catch(err) {
      console.error('[DB] Could not connect to database, terminating', err)
      process.exit(1)
    }
  }

  get ready() {
    return !!this.#connection
  }

  get connection() {
    return this.#connection
  }

  get Servers() {
    if(this.#Servers) return this.#Servers
    return this.connection.getRepository(Server)
  }
}
