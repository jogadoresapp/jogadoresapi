import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerRepository } from './player.repository';
import { Player } from '../../domain/entitites/player.entity';
import { Repository } from 'typeorm';

describe('PlayerRepository', () => {
  let playerRepository: PlayerRepository;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerRepository,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
      ],
    }).compile();

    playerRepository = module.get<PlayerRepository>(PlayerRepository);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(playerRepository).toBeDefined();
  });

  it('should have a repository instance', () => {
    expect(playerRepository['repository']).toBe(repository);
  });
});
