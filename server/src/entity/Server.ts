import { Entity, Column, PrimaryColumn, BeforeInsert, UpdateDateColumn, CreateDateColumn, VersionColumn, Unique, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import User from './User';
import Permissions from './Permissions'

import { nanoid } from 'nanoid'
import Gamedig from 'gamedig'

export const enum ServerType {
  VALVE,
  MINECRAFT,
  RUST,
  OTHER
}

const Protocols = {
  [ServerType.VALVE]: "protocol-valve"
}

interface Player {
  id: String,
  name: String
}

interface ServerDetails {
  online: boolean,
  players: Player[] | null,
  maxplayers?: number
  version?: String,
  gamedata?: any,
  appid?: number
}


@Entity({ name: 'servers' })
@Unique('connect_address', ["ip", "port"])
export default class Server {
  @PrimaryColumn('varchar', { length: 16 })
  id: string
  @BeforeInsert()
  private async createIDIfNotExists() {
    if(!this.id)
      this.id = await Server.generateID()
  }

  @Column({
    length: 64
  })
  name: string

  @Column('int')
  type: ServerType

  @ManyToOne(() => User, user => user.servers)
  @JoinColumn({ name: 'ownerId' })
  owner!: Promise<User>

  @Column({ length: 32 })
  ip: string

  @Column("smallint")
  port: number

  @Column('simple-array')
  tags: string[]

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updatedDate: Date;

  @VersionColumn()
  version: number;

  @Column()
  directory: string

  // TODO: In future, implement more secure way of storing rcon password?
  @Column({ select: false })
  rconPass: string

  @OneToMany(() => Permissions, permissions => permissions.server)
  permissions!: Promise<Permissions[]>;


  private status;
  

  static generateID(): Promise<string> {
    return Promise.resolve(nanoid())
  }

  constructor(id?: string) {
    if(id) {
      this.id = id
    }
  }

  async details(): Promise<ServerDetails> {
    try {
      const state = await Gamedig.query({
        type: Protocols[this.type],
        host: 'lgs.jackz.me', //this.ip,
        port: 27015 //this.port
      })
      
      return {
        online: true,
        players: state.players,
        maxplayers: state.maxplayers,
        version: state.raw.version,
        gamedata: {
          name: state.name,
          map: state.map
        },
        appid: state.raw.appId
      };
    } catch(err) {
      return {
        online: false,
        players: null,
        version: null
      }
    }
  }

  async hasPermission(user: User): Promise<boolean> {
    //TODO: Implement
    return true
  }
 
}
