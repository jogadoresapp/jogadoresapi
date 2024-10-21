import { Test, TestingModule } from '@nestjs/testing';
import { GetPlayerService } from './get-player.service';
import { PlayerRepository } from '../../infrastructure/repositories/player.repository';
import { Player } from '../../domain/entities/player.entity';
import { NotFoundException } from '@nestjs/common';
import {
  PlayerDominantFoot,
  PlayerPosition,
  PlayerPreferredDays,
  PlayerPreferredSchedule,
} from '../../domain/enums/player';

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

  it('deve instanciar o documento', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar um jogador', async () => {
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
    const result = await service.execute('1');
    expect(result).toEqual(player);
    expect(mockPlayerRepository.findById).toHaveBeenCalledWith('1');
  });

  it('deve retornar NotFoundExceptions', async () => {
    mockPlayerRepository.findById.mockResolvedValue(null);
    await expect(service.execute('5')).rejects.toThrow(NotFoundException);
    expect(mockPlayerRepository.findById).toHaveBeenCalledWith('1');
  });
});
