import { Test, TestingModule } from '@nestjs/testing';
import { CreateMatchService } from './create-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { CreateMatchCommand } from '../commands/create-match.command';
import { Match } from '../../domain/entities/match.entity';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';

describe('CreateMatchService', () => {
  let service: CreateMatchService;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMatchService,
        {
          provide: MatchRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateMatchService>(CreateMatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a new match and return its id', async () => {
    const command: CreateMatchCommand = {
      dateGame: '2024-10-15T18:00:00Z',
      playerId: '123e4567-e89b-12d3-a456-426614174000',
      location: 'Estrela da Vila Baummer',
      teamLevel: TEAM_LEVEL.AVANCADO,
      availableSpots: 10,
    };

    const match = Match.newMatch(command);
    const savedMatch = { ...match, id: '123' };

    jest.spyOn(Match, 'newMatch').mockReturnValue(match);
    jest.spyOn(matchRepository, 'save').mockResolvedValue(savedMatch);

    const result = await service.execute(command);

    expect(Match.newMatch).toHaveBeenCalledWith(command);
    expect(matchRepository.save).toHaveBeenCalledWith(match);
    expect(result).toBe('123');
  });
});
