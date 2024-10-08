import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdatePlayerService } from './update-player.service';
import { PlayerRepository } from '../../infraestructure/repositories/player.repository';
import { UpdatePlayerCommand } from '../commands/update-player.command';
import { Player } from '../../domain/entitites/player.entity';

describe('UpdatePlayerService', () => {
  let service: UpdatePlayerService;

  const mockPlayerRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePlayerService,
        {
          provide: PlayerRepository,
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    service = module.get<UpdatePlayerService>(UpdatePlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if player is not found', async () => {
    mockPlayerRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute('1', new UpdatePlayerCommand()),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update the player if found', async () => {
    const player = new Player(
      'John Doe',
      'john@example.com',
      'password123',
      'matchId123',
    );
    mockPlayerRepository.findById.mockResolvedValue(player);
    mockPlayerRepository.update.mockResolvedValue(player);

    const command = new UpdatePlayerCommand();
    const result = await service.execute('1', command);

    expect(result).toEqual(player);
    expect(mockPlayerRepository.findById).toHaveBeenCalledWith('1');
    expect(mockPlayerRepository.update).toHaveBeenCalledWith('1', player);
  });
});
