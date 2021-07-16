import Server from '../entity/Server';
import { Tail } from 'tail';
import { Response } from 'express'
import { existsSync } from 'fs'
import { join } from 'path'

const MAX_LINE_COUNT = 1800

export default class ServerInstance {
    id: string
    directory: string

    private tail: Tail;
    private tailActive = false
    private lines: String[] = []
    private lastLineDate: Number;
    private connections: Response[] = []

    //TODO: Implement system to only watch on demand

    constructor(server: Server) {
        this.id = server.id
        this.directory = server.directory
        //TODO: Read console.log on load, get X lines, use variable if cannot read file for watch() check
    }

    private watch() {
        //`${this.directory}/console.log`
        //Removed for testing:
        /*if(!this.directory || !existsSync(join(this.directory, "console.log"))) {
            return console.warn(`[Server/${this.id}] Cannot watch server, no console.log or invalid directory`)
        }*/
        // If has not been setup, then set it up:
        if(!this.tail) {
            this.tail = new Tail(`S:\\Jackz\\Documents\\Code\\Projects\\rcon-web\\server\\console.log`, {
                useWatchFile: true
            })
            this.tail.on("line", (data: String) => {
                this.lines.push(data)
                this.lastLineDate = Date.now()
                if(this.lines.length > MAX_LINE_COUNT) {
                    this.lines.shift()
                }
                // Send line to all connections
                for(let i = 0; i < this.connections.length; i++) {
                    const client = this.connections[i]
                    if(!client.writable) continue; //Ignore stale for now
                    client.write(`data: ${data}\n\n`)
                }
                
            });
            this.tailActive = true
        } else {
            // Resume log leader if tail has already been established once
            this.tail.watch()
            this.tailActive = true
            this.lines = []
        }
    }

    // Adds a expressJS Resposne stream to connection list, returns index
    addStreamConnection(res: Response): number {
        if(!this.tailActive) {
            this.watch()
        }
        return this.connections.push(res) - 1
        // If log reader inactive, reactivate
    }

    removeStreamConnection(index: number) {
        this.connections.splice(index, 1)
        // If there is no more connections, shut down log reader
        if(this.connections.length == 0) {
            this.tailActive = false
            this.tail.unwatch()
        }
    }

    get logs() {
        return this.lines
    }

    get lastLineTimestamp() { 
        return this.lastLineDate
    }

}