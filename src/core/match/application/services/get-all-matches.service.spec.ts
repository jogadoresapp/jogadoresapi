import { Test, TestingModule } from '@nestjs/testing';
import { GetAllMatchesService } from './get-all-matches.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { Match } from '../../domain/entities/match.entity';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';

describe('GetAllMatchesService', () => {
  let service: GetAllMatchesService;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllMatchesService,
        {
          provide: MatchRepository,
          useValue: {
            findAllByStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetAllMatchesService>(GetAllMatchesService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
  });

  it('should return matches for a valid status', async () => {
    const status = STATUS_MATCH.A_REALIZAR;
    const matches: Match[] = [
      new Match(
        '1',
        '2024-10-15T18:00:00Z',
        '123e4567-e89b-12d3-a456-426614174000',
        'Estrela da Vila Baummer',
        TEAM_LEVEL.AVANCADO,
        10,
        STATUS_MATCH.A_REALIZAR,
      ),
    ];

    jest.spyOn(matchRepository, 'findAllByStatus').mockResolvedValue(matches);

    const result = await service.execute(status);
    expect(result).toEqual(matches);
  });

  it('should return an empty array if no matches are found', async () => {
    const status = STATUS_MATCH.A_REALIZAR;

    jest.spyOn(matchRepository, 'findAllByStatus').mockResolvedValue([]);

    const result = await service.execute(status);
    expect(result).toEqual([]);
  });

  it('should throw an error if repository throws an error', async () => {
    const status = STATUS_MATCH.A_REALIZAR;

    jest
      .spyOn(matchRepository, 'findAllByStatus')
      .mockRejectedValue(new Error('Repository error'));

    await expect(service.execute(status)).rejects.toThrow('Repository error');
  });
});
