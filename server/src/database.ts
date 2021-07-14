import "reflect-metadata";
import { createConnection, Connection, Repository } from "typeorm";

import Server from './entity/Server'
import User from './entity/User';
import Permissions from './entity/Permissions'

export default class Database {
  #connection: Connection = null
  #Servers: Repository<Server>
  #Users: Repository<User>

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
          Server,
          User,
          Permissions
        ],
        synchronize: true,

      })
      this.#connection = connection
      console.info(`[DB] Connected to ${process.env.MYSQL_DB || 'rcon-web'} successfully`)
      if(process.env.CREATE_STARTER_DATA) this.createStarterData()
      return this
    } catch(err) {
      console.error('[DB] Could not connect to database, terminating', err)
      process.exit(1)
    }
  }

  // Returns if the database has been connected
  get connected() {
    return !!this.#connection
  }

  // Gets the typeorm connection
  get connection() {
    return this.#connection
  }

  // Returns the server repository
  get Servers() {
    if(this.#Servers) return this.#Servers
    return this.connection.getRepository(Server)
  }

  // Returns the user repository
  get Users() {
    if(this.#Users) return this.#Users
    return this.connection.getRepository(User)
  }

  //Generates starter data
  private async createStarterData() {
    if(await this.Servers.count() > 0) return
    try {
      const server1 = this.Servers.create({
        id: 'example-server-1',
        name: 'Example Data Server 1',
        ip: 'localhost',
        port: 27029,
        tags: [
          "l4d2",
          "test",
          "example"
        ],
        directory: '/tmp/test'
      })

      const user1 = this.Users.create({
        username: 'admin',
        password: "$2y$12$1TEbqhZ4clzutfszr4gpAeI6kLs.73l1Fsz6.UCSBNTMmdIL9So9q", //example-data
        email: 'test@example.com'
      })

      await this.Servers.save(server1)
      await this.Users.save(user1)

      const user1_perms_server1 = new Permissions(user1.id, server1.id, 1)
      this.connection.manager.save(user1_perms_server1)

      console.info('[DB] Generated starter data')
    } catch(err) {

    }
  }
}
