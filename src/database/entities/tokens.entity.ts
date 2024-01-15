import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {UsersEntity} from './users.entity';
import {JoinColumn} from 'typeorm';

@Entity()
export class TokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn()
  user: UsersEntity;
}