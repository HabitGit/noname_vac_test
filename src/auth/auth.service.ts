import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {UsersEntity} from '../database/entities/users.entity';
import {Repository} from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
  ) {}
  async registration(userData: CreateUserDto) {
    const isUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (isUser) throw new HttpException('Такой юзер уже зарегистрирован', HttpStatus.BAD_REQUEST);
  }
}
