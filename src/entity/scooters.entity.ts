import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne
} from 'typeorm';
import { Rent } from './rent.entity';
import { ScooterState } from './scooterState.entity';

@Entity('scooter')
export class Scooter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255
  })
  license_number: string;

  @Column()
  price: number;

  @ManyToOne(() => ScooterState, (state) => state.scooters)
  state: ScooterState;

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

  @OneToMany(() => Rent, (rent) => rent.scooter)
  rents: Rent[];
}
