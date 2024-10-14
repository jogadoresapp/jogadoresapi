import { Test, TestingModule } from '@nestjs/testing';
import { GetPlayerService } from './get-player.service';
import { PlayerRepository } from '../../infrastructure/repositories/player.repository';
import { Player } from '../../domain/entities/player.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetPlayerService', () => {
  let service: GetPlayerService;

  const mockPlayerRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPlayerService,
        {
          provide: PlayerRepository,
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    service = module.get<GetPlayerService>(GetPlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a player when found', async () => {
    const player = new Player('John Doe', 'john@example.com', 'password123');
    mockPlayerRepository.findById.mockResolvedValue(player);
    const result = await service.execute('1');
    expect(result).toEqual(player);
    expect(mockPlayerRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException when player is not found', async () => {
    mockPlayerRepository.findById.mockResolvedValue(null);
    await expect(service.execute('5')).rejects.toThrow(NotFoundException);
    expect(mockPlayerRepository.findById).toHaveBeenCalledWith('1');
  });
});
