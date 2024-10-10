import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CancelMatchService } from './cancel-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../common/enums/team-level.enum';

describe('CancelMatchService', () => {
  let service: CancelMatchService;
  let matchRepository: MatchRepository;

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

    service = module.get<CancelMatchService>(CancelMatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
  });

  it('should throw NotFoundException if match is not found', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute('1', 'player1')).rejects.toThrow(
      new NotFoundException('Partida com o ID 1 não encontrada.'),
    );
  });

  it('should update match status to CANCELADA and return match id', async () => {
    const match = {
      id: 'existing-id',
      playerId: 'player1',
      dateGame: '2024-10-15T18:00:00Z',
      location: 'Old Location',
      availableSpots: 10,
      status: STATUS_MATCH.A_REALIZAR,
      teamLevel: TEAM_LEVEL.AVANCADO,
    };

    jest.spyOn(matchRepository, 'findById').mockResolvedValue(match);
    jest.spyOn(matchRepository, 'update').mockResolvedValue(null);

    const result = await service.execute('existing-id', 'player1');

    expect(matchRepository.findById).toHaveBeenCalledWith('existing-id');
    expect(matchRepository.update).toHaveBeenCalledWith('existing-id', {
      ...match,
      status: STATUS_MATCH.CANCELADA,
    });
    expect(result).toBe('existing-id');
  });
});
