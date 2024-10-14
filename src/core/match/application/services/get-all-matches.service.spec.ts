import { Test, TestingModule } from '@nestjs/testing';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { GetAllMatchesService } from './get-all-matches.service';
import { GetAllMatchesCommand } from '../commands/get-all-matches.command';
import { Match } from '../../domain/entities/match.entity';

describe('GetAllMatchesService', () => {
  let service: GetAllMatchesService;
  let repository: MatchRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllMatchesService,
        {
          provide: MatchRepository,
          useValue: {
            findAllByFilters: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetAllMatchesService>(GetAllMatchesService);
    repository = module.get<MatchRepository>(MatchRepository);
  });

  it('deve criar a service', () => {
    expect(service).toBeDefined();
  });

  it('deve chamar findAllByFilters com os parâmetros corretos', async () => {
    const query: GetAllMatchesCommand = {
      status: undefined,
      sport: undefined,
      teamLevel: undefined,
      city: 'São Paulo',
      state: 'SP',
      playerId: '123e4567-e89b-12d3-a456-426614174000',
    };

    const matches: Match[] = [];
    jest.spyOn(repository, 'findAllByFilters').mockResolvedValue(matches);

    const result = await service.execute(query);

    expect(repository.findAllByFilters).toHaveBeenCalledWith(query);
    expect(result).toEqual(matches);
  });
});
