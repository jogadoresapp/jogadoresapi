import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetMatchesFromPlayerService } from './get-matches-from-player.service';
import { PlayerRepository } from '../../../player/infrastructure/repositories/player.repository';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { Match } from '../../domain/entities/match.entity';
import { CreateMatchCommand } from '../commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

describe('GetMatchesFromPlayerService', () => {
  let service: GetMatchesFromPlayerService;
  let playerRepository: jest.Mocked<PlayerRepository>;
  let matchRepository: jest.Mocked<MatchRepository>;

  const playerId = '123e4567-e89b-12d3-a456-426614174000';
  const command: CreateMatchCommand = {
    date: new Date(),
    playerId: '123e4567-e89b-12d3-a456-426614174000',
    location: 'Estrela da Vila Baummer',
    teamLevel: TEAM_LEVEL.AVANCADO,
    availableSpots: 10,
    city: 'city',
    state: 'state',
    sport: SPORTS.FUTEBOL,
  };
  const match = Match.newMatch(command);
  const matches: Match[] = [match];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMatchesFromPlayerService,
        {
          provide: PlayerRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: MatchRepository,
          useValue: {
            getMatchesFromPlayer: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetMatchesFromPlayerService>(
      GetMatchesFromPlayerService,
    );
    playerRepository = module.get(PlayerRepository);
    matchRepository = module.get(MatchRepository);
  });

  it('deve criar a service', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar as partidas do jogador', async () => {
    playerRepository.findById.mockResolvedValue({ id: playerId } as any);
    matchRepository.getMatchesFromPlayer.mockResolvedValue(matches);

    const result = await service.execute(playerId);

    expect(result).toEqual(matches);
    expect(playerRepository.findById).toHaveBeenCalledWith(playerId);
    expect(matchRepository.getMatchesFromPlayer).toHaveBeenCalledWith(playerId);
  });

  it('deve lançar NotFoundException ao não achar o jogador', async () => {
    playerRepository.findById.mockResolvedValue(null);

    await expect(service.execute(playerId)).rejects.toThrow(NotFoundException);
    expect(playerRepository.findById).toHaveBeenCalledWith(playerId);
    expect(matchRepository.getMatchesFromPlayer).not.toHaveBeenCalled();
  });
});
