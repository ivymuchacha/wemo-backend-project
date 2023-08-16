import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Scooter } from './scooters.entity';

@Entity('scooterState')
export class ScooterState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Scooter, (scooter) => scooter.state)
  scooters: Scooter[];
}
