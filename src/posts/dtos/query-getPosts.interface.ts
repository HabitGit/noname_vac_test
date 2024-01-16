import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export enum OrderPostsBy {
  author = 'author',
  createdAt = 'createdAt'
}

export class GetPostsQuery {
  @ApiProperty({
    example: 0,
    description: 'Номер страницы',
    required: false,
  })
  @IsOptional()
  page: number;
  @ApiProperty({
    example: 10,
    description: 'Количество статей на странице',
    required: false,
  })
  @IsOptional()
  size: number;
  @ApiProperty({
    enum: OrderPostsBy,
    description: 'Сортировка по автору или дате создания',
    required: false,
  })
  order: string;
}
