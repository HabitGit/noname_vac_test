import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetPostsQuery } from './dtos/query-getPosts.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Статьи')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Создание поста' })
  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() postData: CreatePostDto, @Req() request) {
    return this.postsService.createPost({
      ...postData,
      author: request.user.email,
    });
  }

  @ApiOperation({ summary: 'Получение постов' })
  @Get()
  getPosts(@Query() query: GetPostsQuery) {
    return this.postsService.getPosts(query);
  }

  @ApiOperation({ summary: 'Обновление поста по айди' })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updatePostById(
    @Param('id') id: number,
    @Body() postData: CreatePostDto,
    @Req() request,
  ) {
    const isUserEmail = request.user.email;
    return this.postsService.updatePostById(id, {
      ...postData,
      author: isUserEmail,
    });
  }

  @ApiOperation({ summary: 'Удаление поста по айди' })
  @Delete('/:id')
  deletePostById(@Param('id') id: number) {
    return this.postsService.deletePostById(id);
  }
}
