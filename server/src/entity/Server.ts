import { Entity, Column, PrimaryColumn, BeforeInsert } from "typeorm";
import crypto from 'crypto'

@Entity()
export class Server {
  @PrimaryColumn('varchar', { length: 16 })
  id: String
  @BeforeInsert()
  private async createID() {
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

  @Column()
  tags: String

  @Column()
  created: Date

  @Column()
  directory: String

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
}
