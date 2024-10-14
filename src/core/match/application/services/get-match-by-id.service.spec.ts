import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetMatchByIdService } from './get-match-by-id.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { Match } from '../../domain/entities/match.entity';
import { CreateMatchCommand } from '../commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

describe('GetMatchByIdService', () => {
  let service: GetMatchByIdService;
  let matchRepository: MatchRepository;

  const matchId = '123e4567-e89b-12d3-a456-426614174000';

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
        GetMatchByIdService,
        {
          provide: MatchRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetMatchByIdService>(GetMatchByIdService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
  });

  it('deve criar a service', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar a partida pelo ID', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(match);

    const result = await service.execute(matchId);
    expect(result).toEqual(match);
    expect(matchRepository.findById).toHaveBeenCalledWith(matchId);
  });

  it('deve lançar NotFoundException ao não achar a partida', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute(matchId)).rejects.toThrow(NotFoundException);
    expect(matchRepository.findById).toHaveBeenCalledWith(matchId);
  });
});
