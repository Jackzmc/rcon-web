import { Entity, Column, PrimaryColumn, BeforeInsert, UpdateDateColumn, CreateDateColumn, VersionColumn, Unique, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import crypto from 'crypto'
import User from './User';
import Permissions from './Permissions'


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
}
