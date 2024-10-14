import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetMatchesFromPlayerhService } from './get-matches-from-player.service';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { PlayerRepository } from '../../../player/infrastructure/repositories/player.repository';
import { Match } from '../../domain/entities/match.entity';
import { CreateMatchCommand } from '../commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

describe('GetMatchesFromPlayerhService', () => {
  let service: GetMatchesFromPlayerhService;
  let playerRepository: PlayerRepository;
  let matchPlayerRepository: MatchPlayersRepository;

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
        GetMatchesFromPlayerhService,
        {
          provide: PlayerRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: MatchPlayersRepository,
          useValue: {
            getMatchesFromPlayer: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetMatchesFromPlayerhService>(
      GetMatchesFromPlayerhService,
    );
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
    matchPlayerRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
  });

  it('deve criar a service', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar as partidas do jogador', async () => {
    jest
      .spyOn(playerRepository, 'findById')
      .mockResolvedValue({ id: playerId } as any);
    jest
      .spyOn(matchPlayerRepository, 'getMatchesFromPlayer')
      .mockResolvedValue(matches);

    const result = await service.execute(playerId);
    expect(result).toEqual(matches);
    expect(playerRepository.findById).toHaveBeenCalledWith(playerId);
    expect(matchPlayerRepository.getMatchesFromPlayer).toHaveBeenCalledWith(
      playerId,
    );
  });

  it('deve lançar NotFoundException ao não achar o jogador', async () => {
    jest.spyOn(playerRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute(playerId)).rejects.toThrow(NotFoundException);
    expect(playerRepository.findById).toHaveBeenCalledWith(playerId);
  });
});
