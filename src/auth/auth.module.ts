import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from '@nestjs/config';
import {UsersEntity} from '../database/entities/users.entity';
import {TokensEntity} from '../database/entities/tokens.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT_OUTSIDE),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UsersEntity, TokensEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([TokensEntity])
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
