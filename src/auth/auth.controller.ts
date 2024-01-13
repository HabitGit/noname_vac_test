import {Body, Controller, Post, Res} from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto';
import {Response} from 'express';

@Controller('auth')
export class AuthController {
  @Post('/registration')
  registration(
    @Body() userData: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return 'register';
  }
}
