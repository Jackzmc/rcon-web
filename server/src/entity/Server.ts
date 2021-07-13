import { Entity, Column, PrimaryColumn, BeforeInsert, UpdateDateColumn, CreateDateColumn, VersionColumn, Unique, ManyToMany, JoinTable } from "typeorm";
import crypto from 'crypto'
import { User } from './User';

@Entity({ name: 'servers' })
@Unique(["ip", "port"])
export class Server {
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

  @ManyToMany(() => User, user => user.servers)
  @JoinTable({ name: 'permissions' })
  users: User[];

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
