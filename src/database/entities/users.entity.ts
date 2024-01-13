import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}