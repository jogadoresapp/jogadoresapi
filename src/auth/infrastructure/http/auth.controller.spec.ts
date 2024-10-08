import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginPlayerCommand } from '../../application/commands/login-player.command';
import { LoginPlayerService } from '../../application/services/login-player.service';

import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: LoginPlayerService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginPlayerService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authService = moduleRef.get<LoginPlayerService>(LoginPlayerService);
  });

  it('deve retornar um token JWT em caso de login bem-sucedido', async () => {
    const command: LoginPlayerCommand = {
      email: 'testuser',
      password: 'testpass',
    };
    const token = 'jwt-token';
    jest
      .spyOn(authService, 'execute')
      .mockResolvedValue({ accessToken: token });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(command)
      .expect(200);

    expect(response.body).toEqual({ accessToken: token });
  });

  afterAll(async () => {
    await app.close();
  });
});
