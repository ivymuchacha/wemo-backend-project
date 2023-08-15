import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rent } from './rent.entity';

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

  @Column({
    type: 'int'
  })
  state: number;

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
