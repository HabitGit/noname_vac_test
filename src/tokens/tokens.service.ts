import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateTokensDto } from './dtos/create-tokens.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokensEntity } from '../database/entities/tokens.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(TokensEntity)
    private readonly tokensRepository: Repository<TokensEntity>,
  ) {}

  async generateTokens(userData: CreateTokensDto) {
    const accessToken = this.jwtService.sign(userData, {
      secret: process.env.ACCESS_JWT_SECRET,
      expiresIn: '24h',
    });
    const refreshToken = await this.createRefreshToken(userData);
    return {
      accessToken,
      refreshToken,
    };
  }

  async destroyToken(refreshToken: string) {
    return this.tokensRepository.delete({
      refreshToken,
    });
  }

  async refreshTokens(refreshToken: string) {
    const { id, email } = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_JWT_SECRET,
    });
    return this.generateTokens({ id, email });
  }

  private async createRefreshToken(userData: CreateTokensDto) {
    const refreshToken = this.jwtService.sign(userData, {
      secret: process.env.REFRESH_JWT_SECRET,
      expiresIn: '30d',
    });
    await this.tokensRepository.delete({
      user: userData,
    });
    await this.tokensRepository.save({
      user: userData,
      refreshToken,
    });
    return refreshToken;
  }
}
