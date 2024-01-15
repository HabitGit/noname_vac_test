import {Body, Controller, Post, Res} from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto';
import {Response} from 'express';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}
  @Post('/registration')
  registration(
    @Body() userData: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('user data:', userData);
    return this.authService.registration(userData);
  }
}
