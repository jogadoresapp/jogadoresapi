import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetPlayersMatchesService } from './get-players-matches.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { PlayerRepository } from '../../../player/infraestructure/repositories/player.repository';
import { Player } from '../../../player/domain/entitites/player.entity';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { Match } from '../../domain/entities/match.entity';
import { MatchPlayers } from '../../domain/entities/match-player.entity';
import { CreateMatchCommand } from '../commands/create-match.command';

describe('GetPlayersMatchesService', () => {
  let service: GetPlayersMatchesService;
  let matchRepository: MatchRepository;
  let matchPlayersRepository: MatchPlayersRepository;
  let playerRepository: PlayerRepository;
  let match: Match;
  let matchPlayers: MatchPlayers;
  const playerId = 'player-id-1';
  const command: CreateMatchCommand = {
    dateGame: '2024-10-15T18:00:00Z',
    playerId,
    location: 'Test Location',
    teamLevel: TEAM_LEVEL.INICIANTE,
    availableSpots: 10,
  };

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

    match = Match.newMatch(command);
    match.setId('1');

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

  it('deve retornar os jogadores para um ID de partida válido', async () => {
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

  it('deve lançar NotFoundException se a partida não for encontrada', async () => {
    const matchId = 'invalid-match-id';

    jest
      .spyOn(matchRepository, 'findById')
      .mockResolvedValue(match)
      .mockReturnValue(null);

    await expect(service.execute(matchId)).rejects.toThrow(NotFoundException);
  });
});
