import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { CreateMatchService } from '../../application/services/create-match.service';
import { EditMatchService } from '../../application/services/edit-match.service';
import { GetAllMatchesService } from '../../application/services/get-all-matches.service';
import { RequestToPlayMatchService } from '../../application/services/request-to-play.service';
import { ConfirmMatchService } from '../../application/services/confirm-match.service';
import { CancelMatchService } from '../../application/services/cancel-match.service';
import { ListPendingRequestsMatchesService } from '../../application/services/list-pending-requests-matches.service';
import { GetPlayersMatchesService } from '../../application/services/get-players-matches.service';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ConfirmMatchCommand } from '../../application/commands/confirm-match.command';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { Player } from '../../../player/domain/entitites/player.entity';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../../../auth/infrastructure/strategies/jwt.strategy';
import * as request from 'supertest';
import { GetMatchesByPlayerService } from '../../application/services/get-matches-by-player.service';

describe('MatchController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let matchController: MatchController;
  let createMatchService: CreateMatchService;
  let editMatchService: EditMatchService;
  let getAllMatchesService: GetAllMatchesService;
  let getPlayerMatchesService: GetMatchesByPlayerService;
  let requestToPlayService: RequestToPlayMatchService;
  let confirmMatchService: ConfirmMatchService;
  let cancelMatchService: CancelMatchService;
  let listPendingRequestsService: ListPendingRequestsMatchesService;
  let getPlayersMatchesService: GetPlayersMatchesService;
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
          provide: GetMatchesByPlayerService,
          useValue: {
            execute: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: RequestToPlayMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ConfirmMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: CancelMatchService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ListPendingRequestsMatchesService,
          useValue: {
            execute: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: GetPlayersMatchesService,
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
    getPlayerMatchesService = module.get<GetMatchesByPlayerService>(
      GetMatchesByPlayerService,
    );
    requestToPlayService = module.get<RequestToPlayMatchService>(
      RequestToPlayMatchService,
    );
    confirmMatchService = module.get<ConfirmMatchService>(ConfirmMatchService);
    cancelMatchService = module.get<CancelMatchService>(CancelMatchService);
    listPendingRequestsService = module.get<ListPendingRequestsMatchesService>(
      ListPendingRequestsMatchesService,
    );
    getPlayersMatchesService = module.get<GetPlayersMatchesService>(
      GetPlayersMatchesService,
    );

    const player = new Player('John Doe', 'john@example.com', 'password123');
    token = jwtService.sign({ sub: player.id, email: player.email });
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar uma nova partida', async () => {
    const command = new CreateMatchCommand();
    command.dateGame = '2024-10-15T18:00:00Z';
    command.location = 'Test Location';
    command.availableSpots = 10;

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

  it('deve obter as partidas do jogador', async () => {
    const playerId = 'player-id-1';
    const status = STATUS_MATCH.A_REALIZAR;

    await request(app.getHttpServer())
      .get(`/partidas/jogador/${playerId}`)
      .query({ status })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getPlayerMatchesService.execute).toHaveBeenCalledWith({
      playerId,
      status,
    });
  });

  it('deve solicitar para jogar uma partida', async () => {
    const matchId = 'match-id-1';
    const playerId = 'player-id-1';

    await request(app.getHttpServer())
      .post(`/partidas/${matchId}/solicitar-para-jogar`)
      .set('Authorization', `Bearer ${token}`)
      .send({ playerId })
      .expect(201);

    expect(requestToPlayService.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        matchId: matchId,
        playerId,
      }),
    );
  });

  it('deve confirmar um jogador para uma partida', async () => {
    const matchId = 'match-id-1';
    const playerId = 'player-id-1';

    await request(app.getHttpServer())
      .post(`/partidas/${matchId}/confirmar-jogador`)
      .set('Authorization', `Bearer ${token}`)
      .send({ playerId })
      .expect(201);

    expect(confirmMatchService.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        matchId: matchId,
        playerId,
      }),
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

  it('should list pending requests for a match', async () => {
    const matchId = 'match-id-1';

    await request(app.getHttpServer())
      .get(`/partidas/${matchId}/solicitacoes`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listPendingRequestsService.execute).toHaveBeenCalledWith(matchId);
  });

  it('deve listar solicitações pendentes para uma partida', async () => {
    const matchId = 'match-id-1';

    await request(app.getHttpServer())
      .get(`/partidas/${matchId}/jogadores`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getPlayersMatchesService.execute).toHaveBeenCalledWith(matchId);
  });
});
