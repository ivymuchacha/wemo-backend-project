import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rent } from './rent.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 255
  })
  name: string;

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

  @OneToMany(() => Rent, (rent) => rent.user)
  rents: Rent[];
}
