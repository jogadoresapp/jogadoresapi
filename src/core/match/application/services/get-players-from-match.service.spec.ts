import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetPlayersFromMatchService } from './get-players-from-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { Player } from '../../../player/domain/entities/player.entity';
import { CreateMatchCommand } from '../commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';
import { Match } from '../../domain/entities/match.entity';

describe('GetPlayersFromMatchService', () => {
  let service: GetPlayersFromMatchService;
  let matchRepository: jest.Mocked<MatchRepository>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPlayersFromMatchService,
        {
          provide: MatchRepository,
          useValue: {
            findById: jest.fn(),
            getPlayersFromMatch: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetPlayersFromMatchService>(
      GetPlayersFromMatchService,
    );
    matchRepository = module.get(MatchRepository);
  });

  it('deve criar a service', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar os jogadores da partida', async () => {
    const matchId = match.id;
    const players: Player[] = [{ id: '1', name: 'Player 1' } as Player];

    matchRepository.findById.mockResolvedValue(match);
    matchRepository.getPlayersFromMatch.mockResolvedValue(players);

    const result = await service.execute(matchId);

    expect(result).toEqual(players);
    expect(matchRepository.findById).toHaveBeenCalledWith(matchId);
    expect(matchRepository.getPlayersFromMatch).toHaveBeenCalledWith(matchId);
  });

  it('deve lançar NotFoundException ao não achar a partida', async () => {
    const matchId = match.id;

    matchRepository.findById.mockResolvedValue(null);

    await expect(service.execute(matchId)).rejects.toThrow(NotFoundException);
    expect(matchRepository.findById).toHaveBeenCalledWith(matchId);
    expect(matchRepository.getPlayersFromMatch).not.toHaveBeenCalled();
  });
});
