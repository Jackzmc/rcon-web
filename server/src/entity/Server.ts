import { Entity, Column, PrimaryColumn, BeforeInsert, UpdateDateColumn, CreateDateColumn, VersionColumn, Unique, ManyToMany, JoinTable, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import User from './User';
import Permissions from './Permissions'

import crypto from 'crypto'
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
  id: String
  @BeforeInsert()
  private async createIDIfNotExists() {
    if(!this.id)
      this.id = await Server.generateID()
  }

  @Column({
    length: 64
  })
  name: String

  @Column('int')
  type: ServerType

  @ManyToOne(() => User, user => user.servers)
  @JoinColumn({ name: 'ownerId' })
  owner!: Promise<User>

  @Column({ length: 32 })
  ip: String

  @Column("smallint")
  port: Number

  @Column('simple-array')
  tags: String[]

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updatedDate: Date;

  @VersionColumn()
  version: number;

  @Column()
  directory: String

  @OneToMany(() => Permissions, permissions => permissions.server)
  users!: Permissions[];

  private status;

  static generateID(): Promise<string> {
    return new Promise((res) => {
      crypto.randomBytes(12, (err, buf) => {
          if(err) throw err;
          const enc = buf.toString('base64');
          if(enc.length !== 16) throw 'invalid';
          res(enc);
      });
    })
  }

  constructor(id?: String) {
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
        appid: state.appId
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
