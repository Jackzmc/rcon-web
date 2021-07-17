import Server from '../entity/Server';
import User from '../entity/User';

import { Tail } from 'tail';
import { Response } from 'express'
import { join } from 'path'
import readLastLines from 'read-last-lines';
import Rcon from 'rcon-srcds'

const MAX_LINE_COUNT = 100 //How many recent console lines to keep
const RCON_IDLE_TIMEOUT_SECONDS = 1000 * 60 //How long until the rcon connection is terminated from inactivity

export default class ServerInstance {
    private server: Server

    // Log reading 
    private tail: Tail;
    private tailActive = false
    private lines: String[] = []
    private lastLineDate: Number;
    private connections: Response[] = []
    private logFile: string = null

    // Rcon
    private rcon: Rcon
    private rconIdleTimer: NodeJS.Timeout

    constructor(server: Server) {
        this.server = server

        // Setup the log reader:
        this.logFile = join(this.server.directory, "console.log")
        if(this.server.directory) {
            readLastLines.read(this.logFile, MAX_LINE_COUNT)
                .then((lines) => this.lines = lines.split("\n"))
                .catch(() => {  //File or folder probably doesn't exist
                    this.logFile = null
                    if(process.env.NODE_ENV !== 'production') 
                        console.warn(`[Server/${this.id}] Cannot watch server, log file not found.`)
                })

        }

    }

    private watch() {
        if(!this.logFile) return // If the log file does not exist, just silently ignore
        // If has not been setup, then set it up:
        if(!this.tail) {
            this.tail = new Tail(this.logFile, {
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

    // Attempts to connect to rcon
    private async setupRcon(): Promise<boolean> {
        if(!this.rcon || !this.rcon.connected) {
            // Setup a new rcon connection
            try {
                this.rcon = new Rcon({ host: this.server.ip, port: this.server.port });
                await this.rcon.authenticate(this.server.rconPass);
                return true
            } catch(error) {
                this.rcon = null
                console.warn(`[Server/${this.id}] Connection to rcon failed: ${error}`)
                return false
            } 
        } else {
            throw new Error("Rcon is already connected")
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
    async sendCommand(command: string, user?: User) {
        if(!this.rcon) {
            if(!await this.setupRcon())
                return Promise.reject(new Error("RCON not connected"))
        }
        // Setup rcon idle timeout
        if(!this.rconIdleTimer) clearTimeout(this.rconIdleTimer)
        this.rconIdleTimer = setTimeout(() => {
            this.rcon.disconnect()
            this.rcon = null
        }, RCON_IDLE_TIMEOUT_SECONDS)

        // Finally run command
        return await this.rcon.execute(command)
    }

    get id() {
        return this.server.id
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