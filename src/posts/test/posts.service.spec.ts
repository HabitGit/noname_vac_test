import { PostsService } from '../posts.service';
import { Test } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { Repository } from 'typeorm';
import { PostsEntity } from '../../database/entities/posts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { cacheClient } from '../../database/data-source.redis';

const moduleMocker = new ModuleMocker(global);

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((findOptions) => null),
  save: jest.fn((findOptions) => 1),
}));

jest.mock('redis', () => {
  const originalModule = {
    createClient: jest.fn(function () {
      return {
        on: jest.fn(() => 'on'),
        connect: jest.fn(async () => 'connect'),
        keys: jest.fn(async () => 'keys'),
        del: jest.fn(async () => 'del'),
      };
    }),
  };
  return {
    __esModule: true,
    ...originalModule,
  };
});

describe('Posts service', () => {
  let postsService: PostsService;
  let repositoryMock: MockType<Repository<PostsEntity>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    })
      .useMocker((token) => {
        const results = { email: 'email' };
        if (token === UsersService) {
          return { findUserByEmail: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    postsService = moduleRef.get<PostsService>(PostsService);
    repositoryMock = moduleRef.get(getRepositoryToken(PostsEntity));
  });

  it('posts service has ben defined', async () => {
    expect(postsService).toBeDefined();
  });

  it('create post func is work', async () => {
    const postData = { name: 'test name', description: 'desc', author: 'me' };
    expect(await postsService.createPost(postData)).toEqual(1);
  });

  it('createPost using cache', async () => {
    const cacheSpy = jest.spyOn(cacheClient, 'keys');
    const postData = { name: 'test name', description: 'desc', author: 'me' };
    expect(await postsService.createPost(postData)).toEqual(1);
    expect(cacheSpy).toBeCalled();
  });

  it('createPost using user service', async () => {
    const dbSpy = jest.spyOn(repositoryMock, 'findOne');
    const postData = { name: 'test name', description: 'desc', author: 'me' };
    expect(await postsService.createPost(postData)).toEqual(1);
    expect(dbSpy).toBeCalled();
  });
});
