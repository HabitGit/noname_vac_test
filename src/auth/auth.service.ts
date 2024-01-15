import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { TokensService } from '../tokens/tokens.service';
import { Response } from 'express';
import { CreateTokensDto } from '../tokens/dtos/create-tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async registration(userData: CreateUserDto, response: Response) {
    const isUser = await this.usersService.findUserByEmail(userData.email);
    if (isUser) {
      throw new HttpException(
        'Такой юзер уже зарегистрирован',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userData.password, 7);
    const newUser = await this.usersService.createUser({
      email: userData.email,
      password: hashPassword,
    });
    const tokenData = { id: newUser.id, email: newUser.email };
    return this.getToken(tokenData, response);
  }

  async login(userData: CreateUserDto, response: Response) {
    const isUser = await this.usersService.findUserByEmail(userData.email);
    if (!isUser) {
      throw new HttpException('Юзер не зарегистрирован', HttpStatus.NOT_FOUND);
    }
    if (await bcrypt.compare(userData.password, isUser.password)) {
      const tokenData = { id: isUser.id, email: isUser.email };
      return this.getToken(tokenData, response);
    }
    throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
  }

  async logout(refreshToken: string, response: Response) {
    response.clearCookie('refreshToken');
    return this.tokensService.destroyToken(refreshToken);
  }

  async refreshTokens(oldRefreshToken: string, response: Response) {
    if (!oldRefreshToken) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { accessToken, refreshToken } =
      await this.tokensService.refreshTokens(oldRefreshToken);
    this.setCookie(refreshToken, response);
    return { accessToken };
  }

  private async getToken(userData: CreateTokensDto, response: Response) {
    const { accessToken, refreshToken } =
      await this.tokensService.generateTokens(userData);
    this.setCookie(refreshToken, response);
    return { accessToken };
  }

  private setCookie(refreshToken: string, response: Response) {
    return response.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }
}
