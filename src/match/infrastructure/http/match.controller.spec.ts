import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { CreateMatchService } from '../../application/services/create-match.service';
import { EditMatchService } from '../../application/services/edit-match.service';
import { GetAllMatchesService } from '../../application/services/get-all-matches.service';
import { GetPlayerMatchesService } from '../../application/services/get-player-matches.service';
import { RequestToPlayMatchService } from '../../application/services/request-to-play.service';
import { ConfirmMatchService } from '../../application/services/confirm-match.service';
import { CancelMatchService } from '../../application/services/cancel-match.service';
import { ListPendingRequestsMatchesService } from '../../application/services/list-pending-requests-matches.service';
import { GetPlayersMatchesService } from '../../application/services/get-players-matches.service';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { ConfirmMatchCommand } from '../../application/commands/confirm-match.command';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { Player } from '../../../player/domain/entitites/player.entity';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../../../auth/infrastructure/strategies/jwt.strategy';
import * as request from 'supertest';

describe('MatchController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let matchController: MatchController;
  let createMatchService: CreateMatchService;
  let editMatchService: EditMatchService;
  let getAllMatchesService: GetAllMatchesService;
  let getPlayerMatchesService: GetPlayerMatchesService;
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
          provide: GetPlayerMatchesService,
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
    getPlayerMatchesService = module.get<GetPlayerMatchesService>(
      GetPlayerMatchesService,
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

  it('should create a new match', async () => {
    const command = new CreateMatchCommand();
    command.dateGame = '2024-10-15T18:00:00Z';
    command.location = 'Test Location';
    command.availableSpots = 10;

    const response = await request(app.getHttpServer())
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send(command)
      .expect(201);

    expect(response.body).toEqual({ id: 'match-id-1' });
    expect(createMatchService.execute).toHaveBeenCalledWith(command);
  });

  it('should edit an existing match', async () => {
    const matchId = 'match-id-1';
    const command: Partial<EditMatchCommand> = {
      location: 'Updated Location',
      availableSpots: 15,
    };

    await request(app.getHttpServer())
      .put(`/matches/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(command)
      .expect(200);

    expect(editMatchService.execute).toHaveBeenCalledWith(matchId, command);
  });

  it('should get all matches', async () => {
    await request(app.getHttpServer())
      .get('/matches')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getAllMatchesService.execute).toHaveBeenCalled();
  });

  it('should get player matches', async () => {
    const playerId = 'player-id-1';
    const status = STATUS_MATCH.A_REALIZAR;

    await request(app.getHttpServer())
      .get(`/matches/player/${playerId}`)
      .query({ status })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getPlayerMatchesService.execute).toHaveBeenCalledWith({
      playerId,
      status,
    });
  });

  it('should request to play a match', async () => {
    const matchId = 'match-id-1';
    const playerId = 'player-id-1';

    await request(app.getHttpServer())
      .post(`/matches/${matchId}/request-to-play`)
      .set('Authorization', `Bearer ${token}`)
      .send({ playerId })
      .expect(201);

    expect(requestToPlayService.execute).toHaveBeenCalledWith(
      expect.any(ConfirmMatchCommand),
    );
  });

  it('should confirm a player for a match', async () => {
    const matchId = 'match-id-1';
    const playerId = 'player-id-1';

    await request(app.getHttpServer())
      .post(`/matches/${matchId}/confirm`)
      .set('Authorization', `Bearer ${token}`)
      .send({ playerId })
      .expect(201);

    expect(confirmMatchService.execute).toHaveBeenCalledWith(
      expect.any(ConfirmMatchCommand),
    );
  });

  it('should cancel a match', async () => {
    const matchId = 'match-id-1';
    const playerId = 'player-id-1';

    await request(app.getHttpServer())
      .delete(`/matches/${matchId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ playerId })
      .expect(200);

    expect(cancelMatchService.execute).toHaveBeenCalledWith(matchId, playerId);
  });

  it('should list pending requests for a match', async () => {
    const matchId = 'match-id-1';

    await request(app.getHttpServer())
      .get(`/matches/${matchId}/pending-requests`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listPendingRequestsService.execute).toHaveBeenCalledWith(matchId);
  });

  it('should get all players of a match', async () => {
    const matchId = 'match-id-1';

    await request(app.getHttpServer())
      .get(`/matches/${matchId}/players`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(getPlayersMatchesService.execute).toHaveBeenCalledWith(matchId);
  });
});
