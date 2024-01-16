import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';

const moduleMocker = new ModuleMocker(global);

describe('Posts controller', () => {
  let postsController: PostsController;
  let postsService: PostsService;
  let validationPipe: ValidationPipe;

  const mockPostsService = {
    createPost: jest.fn(() => {
      return 'post created';
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .overrideProvider(PostsService)
      .useValue(mockPostsService)
      .compile();

    postsService = moduleRef.get<PostsService>(PostsService);
    postsController = moduleRef.get<PostsController>(PostsController);
  });

  it('controller to be defined', () => {
    expect(postsController).toBeDefined();
  });

  it('create post valid. data pipe', async () => {
    validationPipe = new ValidationPipe({ transform: true });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreatePostDto,
      data: '',
    };
    const postData = { name: 'test name', description: 'test desc.' };
    expect(await validationPipe.transform(postData, metadata as any)).toEqual(
      postData,
    );
  });

  it('create post invalid. data pipe', async () => {
    validationPipe = new ValidationPipe({ transform: true });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreatePostDto,
      data: '',
    };
    const postData = { name: 123, description: 'test desc.' };
    await validationPipe.transform(postData, metadata as any).catch((err) => {
      expect(err.response.statusCode).toEqual(400);
    });
  });
});
