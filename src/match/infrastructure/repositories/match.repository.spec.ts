import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchRepository } from './match.repository';
import { Match } from '../../domain/entities/match.entity';
import { TEAM_LEVEL } from '../../../common/enums/team-level.enum';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';

describe('MatchRepository', () => {
  let matchRepository: MatchRepository;
  let repository: Repository<Match>;

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

    matchRepository = module.get<MatchRepository>(MatchRepository);
    repository = module.get<Repository<Match>>(getRepositoryToken(Match));
  });

  describe('findById', () => {
    it('should return a match when found', async () => {
      const id = '1';
      const match = new Match(
        '1',
        '2024-10-15T18:00:00Z',
        '123e4567-e89b-12d3-a456-426614174000',
        'Estrela da Vila Baummer',
        TEAM_LEVEL.AVANCADO,
        10,
        STATUS_MATCH.A_REALIZAR,
      );
      match.id = id;
      jest.spyOn(repository, 'findOne').mockResolvedValue(match);

      const result = await matchRepository.findById(id);
      expect(result).toEqual(match);
    });

    it('should return null when no match is found', async () => {
      const id = '1';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await matchRepository.findById(id);
      expect(result).toBeNull();
    });
    describe('save', () => {
      it('should save and return the match', async () => {
        const match = new Match(
          '1',
          '2024-10-15T18:00:00Z',
          '123e4567-e89b-12d3-a456-426614174000',
          'Estrela da Vila Baummer',
          TEAM_LEVEL.AVANCADO,
          10,
          STATUS_MATCH.A_REALIZAR,
        );
        jest.spyOn(repository, 'save').mockResolvedValue(match);

        const result = await matchRepository.save(match);
        expect(result).toEqual(match);
      });
    });

    describe('findAllByStatus', () => {
      it('should return matches with the given status', async () => {
        const status = STATUS_MATCH.A_REALIZAR;
        const matches = [
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
        jest.spyOn(repository, 'find').mockResolvedValue(matches);

        const result = await matchRepository.findAllByStatus(status);
        expect(result).toEqual(matches);
      });
    });

    describe('findAllById', () => {
      it('should return matches with the given ids', async () => {
        const ids = ['1'];
        const matches = [
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
        jest.spyOn(repository, 'findByIds').mockResolvedValue(matches);

        const result = await matchRepository.findAllById(ids);
        expect(result).toEqual(matches);
      });
    });

    describe('update', () => {
      it('should update and return the match', async () => {
        const id = '1';
        const match = new Match(
          '1',
          '2024-10-15T18:00:00Z',
          '123e4567-e89b-12d3-a456-426614174000',
          'Estrela da Vila Baummer',
          TEAM_LEVEL.AVANCADO,
          10,
          STATUS_MATCH.A_REALIZAR,
        );
        const updatedMatch = { ...match, status: STATUS_MATCH.CONFIRMADA };
        jest.spyOn(repository, 'update').mockResolvedValue(undefined);
        jest.spyOn(repository, 'findOne').mockResolvedValue(updatedMatch);

        const result = await matchRepository.update(id, {
          status: STATUS_MATCH.CONFIRMADA,
        });
        expect(result).toEqual(updatedMatch);
      });
    });
  });
});
