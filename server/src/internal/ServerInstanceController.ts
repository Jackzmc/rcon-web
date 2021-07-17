import ServerInstance from './ServerInstance';
import Server from '../entity/Server';
import Database from './database.js';
import { Express } from 'express'


export default class ServerController {
    private instances: ServerInstance[] = [];
    app: Express
    db: Database

    constructor(app: Express, db: Database) {
        this.app = app
        this.db = db
        this.db.Servers.find()
            .then(servers => {
                for(const server of servers) {
                    this.addInstance(new ServerInstance(server))
                }
            })
    }

    addInstance(instance: ServerInstance) {
        this.instances.push(instance)
    }

    getInstanceById(id: String) {
        return this.instances.find(instance => instance.id === id)
    }

    getInstance(server: Server) {
        return this.getInstanceById(server.id)
    }
}