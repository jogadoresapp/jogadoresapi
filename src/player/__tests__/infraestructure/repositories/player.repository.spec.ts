import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerRepository } from '../../../infraestructure/repositories/player.repository';
import { Player } from '../../../domain/entitites/player.entity';
import { Repository } from 'typeorm';

describe('PlayerRepository', () => {
  let playerRepository: PlayerRepository;
  let repository: Repository<Player>;

  const mockPlayer = {
    id: '1',
    email: 'test@example.com',
    name: 'Test Player',
  } as Player;

  const mockRepository = {
    save: jest.fn().mockResolvedValue(mockPlayer),
    findOne: jest.fn().mockResolvedValue(mockPlayer),
    update: jest.fn().mockResolvedValue(mockPlayer),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerRepository,
        {
          provide: getRepositoryToken(Player),
          useValue: mockRepository,
        },
      ],
    }).compile();

    playerRepository = module.get<PlayerRepository>(PlayerRepository);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(playerRepository).toBeDefined();
  });

  it('should save a player', async () => {
    const result = await playerRepository.save(mockPlayer);
    expect(result).toEqual(mockPlayer);
    expect(repository.save).toHaveBeenCalledWith(mockPlayer);
  });

  it('should find a player by id', async () => {
    const result = await playerRepository.findById('1');
    expect(result).toEqual(mockPlayer);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should find a player by email', async () => {
    const result = await playerRepository.findByEmail('test@example.com');
    expect(result).toEqual(mockPlayer);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should update a player', async () => {
    const updatedPlayer = { name: 'Updated Player' };
    const result = await playerRepository.update('1', updatedPlayer);
    expect(result).toEqual(mockPlayer);
    expect(repository.update).toHaveBeenCalledWith('1', updatedPlayer);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
