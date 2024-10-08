import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { RegisterPlayerService } from '../../application/services/register-player.service';
import { GetPlayerService } from '../../application/services/get-player.service';
import { UpdatePlayerService } from '../../application/services/update-player.service';
import { RegisterPlayerCommand } from '../../application/commands/register-player.command';
import { UpdatePlayerCommand } from '../../application/commands/update-player.command';
import { Player } from '../../domain/entitites/player.entity';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('PlayerController', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let playerController: PlayerController;
  let registerPlayerService: RegisterPlayerService;
  let getPlayerService: GetPlayerService;
  let updatePlayerService: UpdatePlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
                new Player(
                  'John Doe',
                  'john@example.com',
                  'password123',
                  'matchId123',
                ),
              ),
          },
        },
        {
          provide: UpdatePlayerService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue(
                new Player(
                  'John Doe',
                  'john@example.com',
                  'password123',
                  'matchId123',
                ),
              ),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    playerController = module.get<PlayerController>(PlayerController);
    registerPlayerService = module.get<RegisterPlayerService>(
      RegisterPlayerService,
    );
    getPlayerService = module.get<GetPlayerService>(GetPlayerService);
    updatePlayerService = module.get<UpdatePlayerService>(UpdatePlayerService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should register a new player', async () => {
    const command = new RegisterPlayerCommand();
    command.name = 'John Doe';
    command.email = 'john@example.com';
    command.password = 'password123';
    const response = await request(app.getHttpServer())
      .post('/player')
      .send(command)
      .expect(201);

    expect(response.body).toEqual({ id: '1' });
    expect(registerPlayerService.execute).toHaveBeenCalledWith(command);
  });

  it('should get a player by id', async () => {
    const playerId = '1';
    const response = await request(app.getHttpServer())
      .get(`/player/${playerId}`)
      .expect(200);

    expect(response.body).toEqual(
      new Player('John Doe', 'john@example.com', 'password123', 'matchId123'),
    );
    expect(getPlayerService.execute).toHaveBeenCalledWith(playerId);
  });

  it('should update a player', async () => {
    const playerId = '1';
    const command: UpdatePlayerCommand = {
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
    };
    const response = await request(app.getHttpServer())
      .put(`/player/${playerId}`)
      .send(command)
      .expect(200);

    expect(response.body).toEqual(
      new Player('John Doe', 'john@example.com', 'password123', 'matchId123'),
    );
    expect(updatePlayerService.execute).toHaveBeenCalledWith(playerId, command);
  });
});
