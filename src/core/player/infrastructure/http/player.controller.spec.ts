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
import { Player } from '../../domain/entities/player.entity';

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
            execute: jest.fn().mockResolvedValue(
              Player.create({
                id: '1',
                name: 'John Doe',
                email: 'jhon@doe.com',
                password: '123432',
              }),
            ),
          },
        },
        {
          provide: UpdatePlayerService,
          useValue: {
            execute: jest.fn().mockResolvedValue(
              Player.create({
                id: '1',
                name: 'John Doe',
                email: 'jhon@doe.com',
                password: '123432',
              }),
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

    player = Player.create({
      id: '1',
      name: 'John Doe',
      email: 'jhon@doe.com',
      password: '123432',
    });
    token = jwtService.sign({ sub: player.id, email: player.email });
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve registrar um novo jogador', async () => {
    const command = new RegisterPlayerCommand();
    command.name = 'John Doe';
    command.email = 'john@example.com';
    command.password = 'password123';

    const response = await request(app.getHttpServer())
      .post('/player')
      .set('Authorization', `Bearer ${token}`)
      .send(command)
      .expect(201);

    expect(response.body).toEqual({ id: '1' });
    expect(registerPlayerService.execute).toHaveBeenCalledWith(command);
  });

  it('deve obter um jogador por ID', async () => {
    const playerId = '1';

    const response = await request(app.getHttpServer())
      .get(`/player/${playerId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(player);
    expect(getPlayerService.execute).toHaveBeenCalledWith(playerId);
  });

  it('deve atualizar um jogador', async () => {
    const playerId = '1';
    const command: UpdatePlayerCommand = {
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
    };

    const response = await request(app.getHttpServer())
      .put(`/player/${playerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(command)
      .expect(200);

    expect(response.body).toEqual(player);
    expect(updatePlayerService.execute).toHaveBeenCalledWith(playerId, command);
  });
});
