import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './users.entity';
import { Scooter } from './scooters.entity';
import { RentStatus } from './rentStatus.entity';

@Entity('rent')
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rents)
  user: User;

  @ManyToOne(() => Scooter, (scooter) => scooter.rents)
  scooter: Scooter;

  @ManyToOne(() => RentStatus, (status) => status.rents)
  status: RentStatus;

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
