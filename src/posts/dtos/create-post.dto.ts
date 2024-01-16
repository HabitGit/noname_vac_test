import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: 'name', description: 'название статьи' })
  name: string;
  @IsString()
  @ApiProperty({ example: 'about this post...', description: 'Описание статьи' })
  description: string;
  author: string;
}
