import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../database/entities/users.entity';

@Module({
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  exports: [UsersService],
})
export class UsersModule {}
