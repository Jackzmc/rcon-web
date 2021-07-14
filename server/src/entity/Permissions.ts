import { Entity, Column, PrimaryColumn, BeforeInsert, UpdateDateColumn, CreateDateColumn, VersionColumn, Unique, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import Server from './Server';
import User from './User';

export enum PermissionFlags {

}

@Entity({ name: 'permissions' })
export default class Permissions {
  @PrimaryColumn()
  private userId: Number

  @PrimaryColumn('varchar', { length: 16 })
  private serverId: String

  @ManyToOne(() => User, user => user.permissions) // inverse "userPlaces: UserPlace[]" is one-to-many in user
  user: User;

  @ManyToOne(() => Server, server => server.users) // inverse "userPlaces: UserPlace[]" is one-to-many in user
  server: Server;

  @Column()
  level: number

  constructor(userId: Number, serverId: String, level?: number) {
    this.userId = userId
    this.serverId = serverId
    this.level = level || 0
  }
}
