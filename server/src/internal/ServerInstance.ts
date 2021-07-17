import Server from '../entity/Server';
import { Tail } from 'tail';
import { Response } from 'express'
import { join } from 'path'
import readLastLines from 'read-last-lines';
import User from 'entity/User';

const MAX_LINE_COUNT = 100

export default class ServerInstance {
    id: string
    directory: string

    private tail: Tail;
    private tailActive = false
    private lines: String[] = []
    private lastLineDate: Number;
    private connections: Response[] = []

    private logFile: string = null

    constructor(server: Server) {
        this.id = server.id
        this.directory = server.directory

        // Setup the logg reader:
        this.logFile = join(this.directory, "console.log")
        if(this.directory) {
            readLastLines.read(this.logFile, MAX_LINE_COUNT)
                .then((lines) => this.lines = lines.split("\n"))
                .catch(() => {  //File or folder probably doesn't exist
                    this.logFile = null
                    if(process.env.NODE_ENV !== 'production') 
                        console.warn(`[Server/${this.id}] Cannot watch server, log file not found.`)
                })

        }
        //TODO: Read console.log on load, get X lines, use variable if cannot read file for watch() check
    }

    private watch() {
        if(!this.logFile) return // If the log file does not exist, just silently ignore
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

    // Adds an expressJS Resposne stream to connection list, returns index
    addStreamConnection(res: Response): number {
        // Start watching the log file if not already
        if(!this.tailActive) {
            this.watch()
        }
        return this.connections.push(res) - 1
        // If log reader inactive, reactivate
    }

    // Remove an expressJS Response stream from list by its index
    removeStreamConnection(index: number) {
        this.connections.splice(index, 1)
        // If there is no more connections, shut down log reader
        if(this.connections.length == 0 && this.tailActive) {
            this.tailActive = false
            this.tail.unwatch()
        }
    }

    // Sends a command to server, via RCON
    sendCommand(command: String, user?: User) {
        
    }

    get logs() {
        return this.lines
    }

    get lastLineTimestamp() { 
        return this.lastLineDate
    }

    get consoleAvailable() {
        return this.logFile != null
    }

}