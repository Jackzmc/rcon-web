import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, Unique, OneToMany, ManyToOne } from "typeorm";
import bcrypt from 'bcrypt'
import Server from './Server';
import Permissions from './Permissions'


const ENCRYPTION_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 12

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn()
  id: Number

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

  @Column('binary', {
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

  login(password: String): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(password, this.password, (err: Error, result: boolean) => {
        if(err) return reject(err)
        resolve(result)
      })
    })
  }

}
