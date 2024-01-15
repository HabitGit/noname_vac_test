import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() postData: CreatePostDto) {
    return 'create';
  }

  @Get()
  getPosts(@Query() query: { sort: string; page: string }) {
    return 'posts';
  }

  @Put('/:id')
  updatePostById(@Param() id: { id: string }, @Body() postData: CreatePostDto) {
    return 'update';
  }

  @Delete('/:id')
  deletePostById(@Param() id: { id: string }) {
    return 'delete';
  }
}
