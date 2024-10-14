import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerRepository } from './player.repository';
import { Player } from '../../domain/entities/player.entity';
import { Repository } from 'typeorm';

describe('PlayerRepository', () => {
  let repository: PlayerRepository;
  let mockRepository: Repository<Player>;

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

    repository = module.get<PlayerRepository>(PlayerRepository);
    mockRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a player', async () => {
      const player = new Player(
        'John Doe',
        'john.doe@example.com',
        'password123',
      );
      jest.spyOn(mockRepository, 'save').mockResolvedValue(player);

      expect(await repository.save(player)).toEqual(player);
      expect(mockRepository.save).toHaveBeenCalledWith(player);
    });
  });

  describe('findById', () => {
    it('should find a player by id', async () => {
      const player = new Player(
        'John Doe',
        'john.doe@example.com',
        'password123',
      );
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(player);

      expect(await repository.findById('1')).toEqual(player);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null if player not found', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(null);

      expect(await repository.findById('1')).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findByEmail', () => {
    it('should find a player by email', async () => {
      const player = new Player(
        'John Doe',
        'john.doe@example.com',
        'password123',
      );
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(player);

      expect(await repository.findByEmail('test@example.com')).toEqual(player);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if player not found', async () => {
      jest.spyOn(mockRepository, 'findOne').mockResolvedValue(null);

      expect(await repository.findByEmail('test@example.com')).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('update', () => {
    it('should update a player', async () => {
      const player = new Player(
        'John Doe',
        'john.doe@example.com',
        'password123',
      );
      jest.spyOn(mockRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findById').mockResolvedValue(player);

      expect(await repository.update('1', { name: 'Updated Name' })).toEqual(
        player,
      );
      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        name: 'Updated Name',
      });
      expect(repository.findById).toHaveBeenCalledWith('1');
    });
  });
});
