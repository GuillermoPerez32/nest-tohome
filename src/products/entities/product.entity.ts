import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
    unique: true,
  })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @BeforeInsert()
  checkSlug() {
    if (this.slug)
      this.slug = this.slug
        .toLocaleLowerCase()
        .replace(' ', '_')
        .replace("'", '');
    else
      this.slug = this.title.toLowerCase().replace(' ', '_').replace("'", '');
  }
}
