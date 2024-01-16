import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from '../database/entities/posts.entity';
import { Repository } from 'typeorm';
import { GetPostsQuery } from './dtos/query-getPosts.interface';
import { UsersService } from '../users/users.service';
import { cacheClient } from '../database/data-source.redis';

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
    await this.invalidCache('posts*');
    const { name, description, author } = postData;
    return this.postsRepository.save({
      name,
      description,
      author,
    });
  }

  async getPosts(query: GetPostsQuery) {
    const { page, size, order = null } = query;
    const { take, skip } = this.getPagination(page, size);
    const cacheKey: string = `posts:${take}:${skip}:${order}`;

    const cache = await cacheClient.get(cacheKey);
    if (cache) return JSON.parse(cache);

    const posts = await this.postsRepository.find({
      take,
      skip,
      order: order ? { [order]: 'ASC' } : null,
    });
    await cacheClient.set(cacheKey, JSON.stringify(posts), { EX: 30 });
    return posts;
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
    await this.invalidCache('posts*');
    await this.postsRepository.update(
      { id },
      {
        ...postData,
      },
    );
    return;
  }

  async deletePostById(id: number) {
    await this.invalidCache('posts*');
    await this.postsRepository.delete({ id });
    return;
  }

  private getPagination(page: number, size: number) {
    const take = size ? size : 10;
    const skip = page ? page * take : 0;

    return { take, skip };
  }

  private async invalidCache(key: string) {
    const cacheKeys: string[] = await cacheClient.keys(key);
    return cacheClient.del(cacheKeys);
  }
}
