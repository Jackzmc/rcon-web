import { Entity, Column, PrimaryColumn, BeforeInsert, UpdateDateColumn, CreateDateColumn, VersionColumn, Unique, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import Server from './Server';
import User from './User';

export enum PermissionFlags {

}

@Entity({ name: 'permissions' })
export default class Permissions {

  @ManyToOne(() => User, user => user.permissions, { primary: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Server, server => server.permissions, { primary: true, eager: true })
  @JoinColumn({ name: 'serverId'})
  server!: Server;

  @Column()
  flags: number

  constructor(user: User, server: Server, flags?: number) {
    this.user = user
    this.server = server
    this.flags = flags || 0
  }
}
