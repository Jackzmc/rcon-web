import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

@Entity({ name: 'sessions' })
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn('varchar', {
    length: 191,
    unique: true
  })
  id: string;

  @Column()
  expiresAt: number;

  @Column('simple-json')
  data: string;
}
