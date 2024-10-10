import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetPlayersMatchesService } from './get-players-matches.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { PlayerRepository } from '../../../player/infraestructure/repositories/player.repository';
import { Player } from '../../../player/domain/entitites/player.entity';
import { TEAM_LEVEL } from '../../../common/enums/team-level.enum';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { Match } from '../../domain/entities/match.entity';
import { MatchPlayers } from '../../domain/entities/match-player.entity';

describe('GetPlayersMatchesService', () => {
  let service: GetPlayersMatchesService;
  let matchRepository: MatchRepository;
  let matchPlayersRepository: MatchPlayersRepository;
  let playerRepository: PlayerRepository;
  let match: Match;
  let matchPlayers: MatchPlayers;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPlayersMatchesService,
        {
          provide: MatchRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: MatchPlayersRepository,
          useValue: {
            findByMatchId: jest.fn(),
          },
        },
        {
          provide: PlayerRepository,
          useValue: {
            findAllByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetPlayersMatchesService>(GetPlayersMatchesService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    matchPlayersRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
    playerRepository = module.get<PlayerRepository>(PlayerRepository);

    match = new Match(
      '1',
      '2024-10-15T18:00:00Z',
      '123e4567-e89b-12d3-a456-426614174000',
      'Estrela da Vila Baummer',
      TEAM_LEVEL.AVANCADO,
      10,
      STATUS_MATCH.A_REALIZAR,
    );

    matchPlayers = {
      matchId: '1',
      players: ['player1', 'player2'],
      pendingRequests: [],
      isPlayerInMatch: jest.fn(),
      hasRequestedToPlay: jest.fn(),
      addPlayer: jest.fn(),
      removePlayer: jest.fn(),
      addPendingRequest: jest.fn(),
      removePendingRequest: jest.fn(),
    };
  });

  it('should return players for a valid match ID', async () => {
    const matchId = 'valid-match-id';
    const players: Player[] = [
      { id: 'player1', name: 'Player 1' } as Player,
      { id: 'player2', name: 'Player 2' } as Player,
    ];

    jest.spyOn(matchRepository, 'findById').mockResolvedValue(match);
    jest
      .spyOn(matchPlayersRepository, 'findByMatchId')
      .mockResolvedValue(matchPlayers);
    jest.spyOn(playerRepository, 'findAllByIds').mockResolvedValue(players);

    const result = await service.execute(matchId);
    expect(result).toEqual(players);
  });

  it('should throw NotFoundException if match is not found', async () => {
    const matchId = 'invalid-match-id';

    jest
      .spyOn(matchRepository, 'findById')
      .mockResolvedValue({
        id: '1',
        dateGame: '2024-10-15T18:00:00Z',
        playerId: '123e4567-e89b-12d3-a456-426614174000',
        location: 'Estrela da Vila Baummer',
        teamLevel: TEAM_LEVEL.AVANCADO,
        availableSpots: 1,
        status: STATUS_MATCH.A_REALIZAR,
      })
      .mockReturnValue(null);

    await expect(service.execute(matchId)).rejects.toThrow(NotFoundException);
  });
});
