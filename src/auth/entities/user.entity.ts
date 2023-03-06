import { Exclude } from 'class-transformer';
import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VALID_ROLES } from '../interfaces';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: [VALID_ROLES.USER],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  products: Product[];

  @BeforeInsert()
  checkBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.fullName = this.fullName
      .trim()
      .split(' ')
      .map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
      .join(' ');
  }
  @BeforeUpdate()
  checkBeforeUpdate() {
    this.checkBeforeInsert();
  }
}
