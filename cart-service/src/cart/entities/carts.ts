import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Carts {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    type: 'uuid'
  })
  user_id: string;

  @Column({
    type: 'date',
  })
  public created_at: string;

  @Column({
    type: 'date',
  })
  public updated_at: string;
}