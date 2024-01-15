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
import { IGetPosts } from './dtos/query-getPosts.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() postData: CreatePostDto, @Req() request) {
    return this.postsService.createPost({
      ...postData,
      author: request.user.email,
    });
  }

  @Get()
  getPosts(@Query() query: IGetPosts) {
    return this.postsService.getPosts(query);
  }

  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updatePostById(
    @Param() id: { id: string },
    @Body() postData: CreatePostDto,
    @Req() request,
  ) {
    const isUserEmail = request.user.email;
    return this.postsService.updatePostById(Number(id.id), {
      ...postData,
      author: isUserEmail,
    });
  }

  @Delete('/:id')
  deletePostById(@Param() id: { id: string }) {
    return this.postsService.deletePostById(Number(id.id));
  }
}
