import { Test, TestingModule } from '@nestjs/testing';
import { RequestToPlayMatchService } from './request-to-play.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { ConfirmMatchCommand } from '../commands/confirm-match.command';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TEAM_LEVEL } from '../../../common/enums/team-level.enum';

describe('RequestToPlayMatchService', () => {
  let service: RequestToPlayMatchService;
  let matchRepository: MatchRepository;
  let matchPlayersRepository: MatchPlayersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestToPlayMatchService,
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
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestToPlayMatchService>(RequestToPlayMatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    matchPlayersRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
    jest.spyOn(matchPlayersRepository, 'findByMatchId').mockResolvedValue({
      matchId: 'match-1',
      players: [],
      pendingRequests: [],
      isPlayerInMatch: jest.fn().mockReturnValue(true),
      hasRequestedToPlay: jest.fn().mockReturnValue(false),
      addPlayer: jest.fn(),
      removePlayer: jest.fn(),
      addPendingRequest: jest.fn(),
      removePendingRequest: jest.fn(),
    });
  });

  it('should throw NotFoundException if match is not found', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(null);
    const command = new ConfirmMatchCommand('match-1', 'player-1');

    await expect(service.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if match status is not A_REALIZAR', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue({
      id: '1',
      dateGame: '2024-10-15T18:00:00Z',
      playerId: '123e4567-e89b-12d3-a456-426614174000',
      location: 'Estrela da Vila Baummer',
      teamLevel: TEAM_LEVEL.AVANCADO,
      availableSpots: 10,
      status: STATUS_MATCH.A_REALIZAR,
    });
    const command = new ConfirmMatchCommand('match-1', 'player-1');

    await expect(service.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if no available spots in match', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue({
      id: '1',
      dateGame: '2024-10-15T18:00:00Z',
      playerId: '123e4567-e89b-12d3-a456-426614174000',
      location: 'Estrela da Vila Baummer',
      teamLevel: TEAM_LEVEL.AVANCADO,
      availableSpots: 10,
      status: STATUS_MATCH.A_REALIZAR,
    });
    const command = new ConfirmMatchCommand('match-1', 'player-1');

    await expect(service.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if player is already in match', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue({
      id: '1',
      dateGame: '2024-10-15T18:00:00Z',
      playerId: '123e4567-e89b-12d3-a456-426614174000',
      location: 'Estrela da Vila Baummer',
      teamLevel: TEAM_LEVEL.AVANCADO,
      availableSpots: 1,
      status: STATUS_MATCH.A_REALIZAR,
    });

    const command = new ConfirmMatchCommand('match-1', 'player-1');

    await expect(service.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if player has already requested to play', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue({
      id: '1',
      dateGame: '2024-10-15T18:00:00Z',
      playerId: '123e4567-e89b-12d3-a456-426614174000',
      location: 'Estrela da Vila Baummer',
      teamLevel: TEAM_LEVEL.AVANCADO,
      availableSpots: 1,
      status: STATUS_MATCH.A_REALIZAR,
    });
    jest.spyOn(matchPlayersRepository, 'findByMatchId').mockResolvedValue({
      matchId: 'match-1',
      players: [],
      pendingRequests: [],
      isPlayerInMatch: jest.fn().mockReturnValue(false),
      hasRequestedToPlay: jest.fn().mockReturnValue(true),
      addPlayer: jest.fn(),
      removePlayer: jest.fn(),
      addPendingRequest: jest.fn(),
      removePendingRequest: jest.fn(),
    });
    const command = new ConfirmMatchCommand('match-1', 'player-1');

    await expect(service.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('should add pending request and save match players', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue({
      id: '1',
      dateGame: '2024-10-15T18:00:00Z',
      playerId: '123e4567-e89b-12d3-a456-426614174000',
      location: 'Estrela da Vila Baummer',
      teamLevel: TEAM_LEVEL.AVANCADO,
      availableSpots: 1,
      status: STATUS_MATCH.A_REALIZAR,
    });
    const matchPlayers = {
      matchId: 'match-1',
      players: [],
      pendingRequests: [],
      isPlayerInMatch: jest.fn().mockReturnValue(false),
      hasRequestedToPlay: jest.fn().mockReturnValue(false),
      addPlayer: jest.fn(),
      removePlayer: jest.fn(),
      addPendingRequest: jest.fn(),
      removePendingRequest: jest.fn(),
    };

    jest
      .spyOn(matchPlayersRepository, 'findByMatchId')
      .mockResolvedValue(matchPlayers);
    const command = new ConfirmMatchCommand('match-1', 'player-1');

    await service.execute(command);

    expect(matchPlayers.addPendingRequest).toHaveBeenCalledWith('player-1');
    expect(matchPlayersRepository.save).toHaveBeenCalledWith(matchPlayers);
  });
});
