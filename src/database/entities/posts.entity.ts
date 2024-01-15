import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity()
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: '150',
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @ManyToOne(() => UsersEntity, (user) => user.posts)
  author: UsersEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
