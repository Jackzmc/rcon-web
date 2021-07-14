import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, Unique, OneToMany, ManyToOne } from "typeorm";
import bcrypt from 'bcrypt'
import Server from './Server';
import Permissions from './Permissions'


const ENCRYPTION_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 12

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', {
    length: 64,
    unique: true
  })
  username: String

  @Column('varchar', {
    length: 191,
    unique: true
  })
  email: String

  @Column('char', {
    length: 60,
    select: false
  })
  password: String

  @CreateDateColumn()
  created: Date

  @Column()
  lastLogin: Date;

  @OneToMany(() => Permissions, permissions => permissions.user, { cascade: true })
  permissions!: Permissions[]

  @OneToMany(() => Server, server => server.owner, { cascade: ['remove'] })
  servers: Server[]

  async login(password: String): Promise<boolean> {
    const match = await bcrypt.compare(password, this.password);

    if(match) {
      this.lastLogin = new Date()
    }
    return match
  }

}
