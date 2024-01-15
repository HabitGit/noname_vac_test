import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '../database/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async createUser(userData: CreateUserDto) {
    return this.usersRepository.save({
      ...userData,
    });
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
