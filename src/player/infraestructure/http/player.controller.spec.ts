/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { RegisterPlayerService } from '../../application/services/register-player.service';
import { GetPlayerService } from '../../application/services/get-player.service';
import { UpdatePlayerService } from '../../application/services/update-player.service';
import { RegisterPlayerCommand } from '../../application/commands/register-player.command';
import { UpdatePlayerCommand } from '../../application/commands/update-player.command';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../../../auth/infrastructure/strategies/jwt.strategy';
import { Player } from '../../domain/entitites/player.entity';

describe('PlayerController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let playerController: PlayerController;
  let registerPlayerService: RegisterPlayerService;
  let getPlayerService: GetPlayerService;
  let updatePlayerService: UpdatePlayerService;
  let player: Player;
  let token: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [PlayerController],
      providers: [
        {
          provide: RegisterPlayerService,
          useValue: {
            execute: jest.fn().mockResolvedValue('1'),
          },
        },
        {
          provide: GetPlayerService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue(
                new Player('John Doe', 'john@example.com', 'password123'),
              ),
          },
        },
        {
          provide: UpdatePlayerService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue(
                new Player('John Doe', 'john@example.com', 'password123'),
              ),
          },
        },
        JwtStrategy,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    app = module.createNestApplication();
    await app.init();

    jwtService = module.get<JwtService>(JwtService);
    playerController = module.get<PlayerController>(PlayerController);
    registerPlayerService = module.get<RegisterPlayerService>(
      RegisterPlayerService,
    );
    getPlayerService = module.get<GetPlayerService>(GetPlayerService);
    updatePlayerService = module.get<UpdatePlayerService>(UpdatePlayerService);

    player = new Player('John Doe', 'john@example.com', 'password123');
    token = jwtService.sign({ sub: player.id, email: player.email });
  });

  afterAll(async () => {
    await app.close();
  });

  const makeRequest = async (
    method: 'post' | 'get' | 'put',
    url: string,
    data?: any,
    statusCode = 200,
  ) => {
    let req = request(app.getHttpServer())
      [method](url)
      .set('Authorization', `Bearer ${token}`);

    if (data) {
      req = req.send(data);
    }

    const response = await req.expect(statusCode);
    return response;
  };

  it('deve registrar um novo jogador', async () => {
    const command = new RegisterPlayerCommand();
    command.name = 'John Doe';
    command.email = 'john@example.com';
    command.password = 'password123';

    const response = await makeRequest('post', '/player', command, 201);

    expect(response.body).toEqual({ id: '1' });
    expect(registerPlayerService.execute).toHaveBeenCalledWith(command);
  });

  it('deve obter um jogador por ID', async () => {
    const playerId = '1';

    const response = await makeRequest('get', `/player/${playerId}`);

    expect(response.body).toEqual(player);
    expect(getPlayerService.execute).toHaveBeenCalledWith(playerId);
  });

  it('deve atualizar um jogador', async () => {
    const playerId = '1';
    const command: UpdatePlayerCommand = {
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
    };

    const response = await makeRequest('put', `/player/${playerId}`, command);

    expect(response.body).toEqual(player);
    expect(updatePlayerService.execute).toHaveBeenCalledWith(playerId, command);
  });
});
