import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { Response } from 'express';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

describe('auth controller', () => {
  let authController: AuthController;
  let authService: AuthService;
  let response: Response;
  let validationPipe: ValidationPipe;

  const mockAuthService = {
    registration: jest.fn(() => {
      return 'register work';
    }),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('controller to be defined', () => {
    expect(authController).toBeDefined();
  });

  it('spy auth service', async () => {
    const userData = { email: 'test', password: 'test' };
    const registerSpy = jest.spyOn(authService, 'registration');
    expect(await authController.registration(userData, response)).toEqual(
      'register work',
    );
    expect(registerSpy).toBeCalledTimes(1);
  });

  it('registration validate data', async () => {
    validationPipe = new ValidationPipe({ transform: true });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateUserDto,
      data: '',
    };
    const userData = { email: 'test@test.test', password: 'test' };
    expect(await validationPipe.transform(userData, metadata as any)).toEqual(
      userData,
    );
  });

  it('invalid registration data', async () => {
    validationPipe = new ValidationPipe({ transform: true });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateUserDto,
      data: '',
    };
    const userData = { email: 'test', password: 'test' };
    await validationPipe.transform(userData, metadata as any).catch((err) => {
      expect(err.response.statusCode).toEqual(400);
    });
  });
});
