import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  author: string;
}
