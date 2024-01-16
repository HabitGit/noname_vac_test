import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@test.test', description: 'Email' })
  readonly email: string;
  @IsString()
  @ApiProperty({ example: 'mypas123', description: 'password' })
  readonly password: string;
}
