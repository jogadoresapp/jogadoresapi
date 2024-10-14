import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { CreateMatchService } from '../../application/services/create-match.service';
import { EditMatchService } from '../../application/services/edit-match.service';
import { GetAllMatchesService } from '../../application/services/get-all-matches.service';
import { CancelMatchService } from '../../application/services/cancel-match.service';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { JoinMatchService } from '../../application/services/join-match.service';
import { LeaveMatchService } from '../../application/services/leave-match.service';
import { GetMatchByIdService } from '../../application/services/get-match-by-id.service';
import { GetPlayersFromMatchService } from '../../application/services/get-players-from-match.service';
import { GetMatchesFromPlayerhService } from '../../application/services/get-matches-from-player.service';
import { MatchCommand } from '../../application/commands/match.command';
import { Player } from '../../../player/domain/entities/player.entity';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../../../auth/infrastructure/strategies/jwt.strategy';
import * as request from 'supertest';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

describe('MatchController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let matchController: MatchController;
  let createMatchService: CreateMatchService;
  let editMatchService: EditMatchService;
  let getAllMatchesService: GetAllMatchesService;
  let joinMatchService: JoinMatchService;
  let leaveMatchService: LeaveMatchService;
  let getMatchByIdService: GetMatchByIdService;
  let cancelMatchService: CancelMatchService;
  let getPlayersFromMatchService: GetPlayersFromMatchService;
  let getMatchesFromPlayerhService: GetMatchesFromPlayerhService;
  let token: string;

  const command: CreateMatchCommand = {
    date: new Date().toISOString() as any,
    playerId: '123e4567-e89b-12d3-a456-426614174000',
    location: 'Estrela da Vila Baummer',
    teamLevel: TEAM_LEVEL.AVANCADO,
    availableSpots: 10,
    city: 'city',
    state: 'state',
    sport: SPORTS.FUTEBOL,
  };

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [MatchController],
      providers: [
        {
          provide: CreateMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue('match-id-1'),
          },
        },
        {
          provide: EditMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: GetAllMatchesService,
          useValue: {
            execute: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: JoinMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: LeaveMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: GetMatchByIdService,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CancelMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: GetPlayersFromMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: GetMatchesFromPlayerhService,
          useValue: {
            execute: jest.fn().mockResolvedValue([]),
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
    matchController = module.get<MatchController>(MatchController);
    createMatchService = module.get<CreateMatchService>(CreateMatchService);
    editMatchService = module.get<EditMatchService>(EditMatchService);
    getAllMatchesService =
      module.get<GetAllMatchesService>(GetAllMatchesService);
    joinMatchService = module.get<JoinMatchService>(JoinMatchService);
    leaveMatchService = module.get<LeaveMatchService>(LeaveMatchService);
    getMatchByIdService = module.get<GetMatchByIdService>(GetMatchByIdService);
    cancelMatchService = module.get<CancelMatchService>(CancelMatchService);
    getPlayersFromMatchService = module.get<GetPlayersFromMatchService>(
      GetPlayersFromMatchService,
    );
    getMatchesFromPlayerhService = module.get<GetMatchesFromPlayerhService>(
      GetMatchesFromPlayerhService,
    );

    const player = new Player('John Doe', 'john@example.com', 'password123');
    token = jwtService.sign({ sub: player.id, email: player.email });
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar uma nova partida', async () => {
    const response = await request(app.getHttpServer())
      .post('/partidas')
      .set('Authorization', `Bearer ${token}`)
      .send(command)
      .expect(201);

    expect(response.body).toEqual({ id: 'match-id-1' });
    expect(createMatchService.execute).toHaveBeenCalledWith(command);
  });

  it('deve editar uma partida existente', async () => {
    const matchId = 'match-id-1';
    const command: Partial<EditMatchCommand> = {
      location: 'Updated Location',
      availableSpots: 15,
    };

    await request(app.getHttpServer())
      .put(`/partidas/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(command)
      .expect(200);

    expect(editMatchService.execute).toHaveBeenCalledWith(matchId, command);
  });

  it('deve obter todas as partidas', async () => {
    await request(app.getHttpServer())
      .get('/partidas')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getAllMatchesService.execute).toHaveBeenCalled();
  });

  it('deve entrar em uma partida', async () => {
    const command = new MatchCommand('match-id-1', {
      id: 'player-id-1',
    } as Pick<Player, 'id'>);

    await request(app.getHttpServer())
      .post(`/partidas/${command.matchId}/entrar-na-partida`)
      .set('Authorization', `Bearer ${token}`)
      .send({ playerId: command.playerId })
      .expect(201);

    expect(joinMatchService.execute).toHaveBeenCalledWith(
      new MatchCommand(command.matchId, command.playerId),
    );
  });

  it('deve sair de uma partida', async () => {
    const command = new MatchCommand('match-id-1', {
      id: 'player-id-1',
    } as Pick<Player, 'id'>);

    await request(app.getHttpServer())
      .post(`/partidas/${command.matchId}/sair-da-partida`)
      .set('Authorization', `Bearer ${token}`)
      .send({ playerId: command.playerId })
      .expect(201);

    expect(leaveMatchService.execute).toHaveBeenCalledWith(
      new MatchCommand(command.matchId, command.playerId),
    );
  });

  it('deve cancelar uma partida', async () => {
    const matchId = 'match-id-1';

    await request(app.getHttpServer())
      .delete(`/partidas/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(cancelMatchService.execute).toHaveBeenCalledWith(matchId);
  });

  it('deve obter uma partida pelo ID', async () => {
    const matchId = 'match-id-1';

    await request(app.getHttpServer())
      .get(`/partidas/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getMatchByIdService.execute).toHaveBeenCalledWith(matchId);
  });

  it('deve obter jogadores de uma partida', async () => {
    const matchId = 'match-id-1';

    await request(app.getHttpServer())
      .get(`/partidas/${matchId}/jogadores`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getPlayersFromMatchService.execute).toHaveBeenCalledWith(matchId);
  });

  it('deve obter partidas de um jogador', async () => {
    const playerId = 'player-id-1';

    await request(app.getHttpServer())
      .get(`/partidas/${playerId}/partidas`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getMatchesFromPlayerhService.execute).toHaveBeenCalledWith(playerId);
  });
});
