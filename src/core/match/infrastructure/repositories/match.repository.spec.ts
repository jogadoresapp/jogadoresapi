import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchRepository } from './match.repository';
import { Match } from '../../domain/entities/match.entity';
import { GetAllMatchesCommand } from '../../application/commands/get-all-matches.command';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';
import { EditMatchCommand } from '../../application/commands/edit-match.command';

describe('MatchRepository', () => {
  let repository: MatchRepository;
  let mockRepository: Repository<Match>;
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

  const commandEdit: EditMatchCommand = {
    location: 'New Location',
    availableSpots: 10,
  };
  const match = Match.newMatch(command);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchRepository,
        {
          provide: getRepositoryToken(Match),
          useClass: Repository,
        },
      ],
    }).compile();
    match.setId(matchId);
    repository = module.get<MatchRepository>(MatchRepository);
    mockRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
  });

  it('deve salvar uma partida', async () => {
    jest.spyOn(mockRepository, 'save').mockResolvedValue(match);

    expect(await repository.save(match)).toBe(match);
  });

  it('deve encontrar uma partida pelo id', async () => {
    jest.spyOn(mockRepository, 'findOne').mockResolvedValue(match);

    expect(await repository.findById('existing-id')).toBe(match);
  });

  it('deve atualizar uma partida', async () => {
    jest.spyOn(mockRepository, 'update').mockResolvedValue(undefined);
    jest.spyOn(repository, 'findById').mockResolvedValue(match);

    const matchEdit = match.updateMatch(commandEdit);
    expect(await repository.update('existing-id', matchEdit as any)).toBe(
      match,
    );
  });

  it('deve encontrar todas as partidas pelos filtros', async () => {
    const query: GetAllMatchesCommand = {
      status: undefined,
      sport: undefined,
      teamLevel: undefined,
      city: 'São Paulo',
      state: 'SP',
      playerId: '123e4567-e89b-12d3-a456-426614174000',
    };
    const matches = [match];

    const createQueryBuilder: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(matches),
    };

    jest
      .spyOn(mockRepository, 'createQueryBuilder')
      .mockReturnValue(createQueryBuilder);

    expect(await repository.findAllByFilters(query)).toBe(matches);
  });
});
