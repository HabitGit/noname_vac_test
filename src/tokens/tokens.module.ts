import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensEntity } from '../database/entities/tokens.entity';

@Module({
  providers: [TokensService],
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([TokensEntity])],
  exports: [TokensService],
})
export class TokensModule {}
