import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  full_name: string;

  @Column('bool', {
    default: true,
  })
  is_active: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];
}
