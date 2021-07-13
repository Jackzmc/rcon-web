import { Entity, Column, PrimaryColumn } from "typeorm";
import crypto from 'crypto'

@Entity()
export class Server {
  @PrimaryColumn({ length: 16 })
  id: String

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

  static generateID() {
    return new Promise((res) => {
      crypto.randomBytes(12, (err, buf) => {
          if(err) throw err;
          const enc = buf.toString('base64');
          if(enc.length !== 16) throw 'invalid';
          res(enc);
      });
    });
  }
}
