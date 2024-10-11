import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ListPendingRequestsMatchesService } from './list-pending-requests-matches.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { Match } from '../../domain/entities/match.entity';
import { CreateMatchCommand } from '../commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { MatchPlayers } from '../../domain/entities/match-player.entity';

describe('ListPendingRequestsMatchesService', () => {
  let service: ListPendingRequestsMatchesService;
  let matchRepository: MatchRepository;
  let matchPlayersRepository: MatchPlayersRepository;

  const matchId = 'existing-match-id';
  const playerId1 = 'player-id-1';
  const playerId2 = 'player-id-2';
  const pendingRequests = [playerId1, playerId2];
  let match: Match;
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
        ListPendingRequestsMatchesService,
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
      ],
    }).compile();

    service = module.get<ListPendingRequestsMatchesService>(
      ListPendingRequestsMatchesService,
    );
    matchRepository = module.get<MatchRepository>(MatchRepository);
    matchPlayersRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
    match = Match.newMatch(command);
    match.setId(matchId);
  });

  it('should throw NotFoundException if match is not found', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute(matchId)).rejects.toThrow(
      new NotFoundException('Partida com ID existing-match-id não encontrado'),
    );
  });

  it('should return pending requests for a valid match', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(match);

    const matchPlayers = new MatchPlayers(matchId);
    matchPlayers.pendingRequests = pendingRequests;

    jest
      .spyOn(matchPlayersRepository, 'findByMatchId')
      .mockResolvedValue(matchPlayers);

    const result = await service.execute(matchId);

    expect(result).toEqual(pendingRequests);
    expect(matchRepository.findById).toHaveBeenCalledWith(matchId);
    expect(matchPlayersRepository.findByMatchId).toHaveBeenCalledWith(matchId);
  });
});
