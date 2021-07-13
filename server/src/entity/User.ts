import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, Unique } from "typeorm";
import bcrypt from 'bcrypt'
import { Server } from './Server';

const ENCRYPTION_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 12

@Entity({ name: 'users' })
@Unique(["email"])
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn()
  id: Number

  @Column('varchar', {
    length: 64
  })
  username: String

  @Column('varchar', {
    length: 255
  })
  email: String

  @Column({
    length: 128,
    select: false
  })
  password: String

  @CreateDateColumn()
  created: Date

  @Column()
  lastLogin: Date;

  @ManyToMany(() => Server, server => server.users)
  servers: Server[]

  login(password: String): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(password, this.password, (err: Error, result: boolean) => {
        if(err) return reject(err)
        resolve(result)
      })
    })
  }

}
