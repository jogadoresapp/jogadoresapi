import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdatePlayerService } from './update-player.service';
import { PlayerRepository } from '../../infrastructure/repositories/player.repository';
import { UpdatePlayerCommand } from '../commands/update-player.command';
import { Player } from '../../domain/entities/player.entity';
import {
  PlayerDominantFoot,
  PlayerPosition,
  PlayerPreferredDays,
  PlayerPreferredSchedule,
} from '../../domain/enums/player';

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

  it('deve estar definido service', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if player is not found', async () => {
    mockPlayerRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute('1', new UpdatePlayerCommand()),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar o jogador se ele for encontrado', async () => {
    const player = Player.create({
      id: '1',
      name: 'John Doe',
      email: 'jhon@doe.com',
      password: '123432',
      nickname: 'John',
      position: [PlayerPosition.ATACANTE],
      dominantFoot: PlayerDominantFoot.AMBIDESTRO,
      preferredSchedule: [PlayerPreferredSchedule.MANHA],
      preferredDays: [PlayerPreferredDays.DOMINGO],
      city: 'São Paulo',
      state: 'SP',
      rating: 10,
    });
    mockPlayerRepository.findById.mockResolvedValue(player);
    mockPlayerRepository.update.mockResolvedValue(player);

    const command = new UpdatePlayerCommand();
    const result = await service.execute('1', command);

    expect(result).toEqual(player);
    expect(mockPlayerRepository.findById).toHaveBeenCalledWith('1');
    expect(mockPlayerRepository.update).toHaveBeenCalledWith('1', player);
  });
});
