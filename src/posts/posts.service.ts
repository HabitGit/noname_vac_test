import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from '../database/entities/posts.entity';
import { Repository } from 'typeorm';
import { IGetPosts } from './dtos/query-getPosts.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly usersService: UsersService,
  ) {}

  async createPost(postData: CreatePostDto) {
    const isUser = await this.usersService.findUserByEmail(postData.author);
    if (!isUser) {
      throw new HttpException(
        'Такой автор не зарегистрирован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isPost = await this.postsRepository.findOne({
      where: { name: postData.name },
    });
    if (isPost) {
      throw new HttpException(
        'Такое название поста уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { name, description, author } = postData;
    return this.postsRepository.save({
      name,
      description,
      author,
    });
  }

  async getPosts(query: IGetPosts) {
    const { page, size, order } = query;
    const { take, skip } = this.getPagination(page, size);
    return this.postsRepository.find({
      skip,
      take,
      order: order ? { [order]: 'ASC' } : null,
    });
  }

  private getPagination(page: number, size: number) {
    const take = size ? size : 10;
    const skip = page ? page * take : 0;

    return { take, skip };
  }

  async updatePostById(id: number, postData: CreatePostDto) {
    const isPost = await this.postsRepository.findOne({
      where: { id },
    });
    if (!isPost) {
      throw new HttpException(
        'Такого поста не существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (isPost.author !== postData.author) {
      throw new HttpException(
        'Вы не можете изменить чужой пост',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.postsRepository.update(
      { id },
      {
        ...postData,
      },
    );
  }

  async deletePostById(id: number) {
    await this.postsRepository.delete({ id });
  }
}
