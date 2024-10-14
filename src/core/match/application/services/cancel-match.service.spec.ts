import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CancelMatchService } from './cancel-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { Match } from '../../domain/entities/match.entity';
import { CreateMatchCommand } from '../commands/create-match.command';
import { SPORTS } from '../../../../common/enums/sports.enum';

describe('CancelMatchService', () => {
  let service: CancelMatchService;
  let matchRepository: MatchRepository;

  let match: Match;

  const matchId = 'existing-id';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelMatchService,
        {
          provide: MatchRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();
    match = Match.newMatch(command);
    match.setId(matchId);
    service = module.get<CancelMatchService>(CancelMatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
  });

  it('deve lançar NotFoundException se a partida não for encontrada', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute('1')).rejects.toThrow(
      new NotFoundException('Partida com ID 1 não encontrado'),
    );
  });

  it('deve atualizar o status da partida para CANCELADA e retornar o id da partida', async () => {
    match.setStatus(STATUS_MATCH.A_REALIZAR);
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(match);
    jest.spyOn(matchRepository, 'update').mockResolvedValue(null);

    const result = await service.execute(matchId);

    expect(matchRepository.findById).toHaveBeenCalledWith(matchId);
    expect(matchRepository.update).toHaveBeenCalledWith(matchId, {
      ...match,
      status: STATUS_MATCH.CANCELADA,
    });
    expect(result).toBe(matchId);
  });
});
