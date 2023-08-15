import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './users.entity';
import { Scooter } from './scooters.entity';

@Entity('rent')
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rents)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => Scooter, (scooter) => scooter.rents)
  @JoinColumn({ name: 'scooterId' })
  scooter: Scooter;

  @Column({ nullable: false })
  scooterId: number;

  @Column({
    type: 'int'
  })
  status: number;

  @Column({
    type: 'timestamp'
  })
  start_time: Date;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  end_time: Date;

  @Column({
    type: 'timestamp',
    default: () => 'NOW()'
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'NOW()',
    onUpdate: 'NOW()'
  })
  updated_at: Date;
}
