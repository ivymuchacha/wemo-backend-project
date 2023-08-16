import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rent } from './rent.entity';

@Entity('rentStatus')
export class RentStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Rent, (rent) => rent.status)
  rents: Rent[];
}
