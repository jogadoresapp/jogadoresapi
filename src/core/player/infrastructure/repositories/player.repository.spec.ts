import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerRepository } from './player.repository';
import { Player, PlayerDocument } from '../../domain/entities/player.entity';

describe('PlayerRepository', () => {
  let repository: PlayerRepository;
  let mockModel: Model<PlayerDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerRepository,
        {
          provide: getModelToken(Player.name),
          useValue: {
            create: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<PlayerRepository>(PlayerRepository);
    mockModel = module.get<Model<PlayerDocument>>(getModelToken(Player.name));
  });

  it('deve instanciar o repository', () => {
    expect(repository).toBeDefined();
  });

  it('should save a player', async () => {
    const playerData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const savedPlayer = {
      ...playerData,
      _id: 'some-id',
      toObject: jest.fn().mockReturnValue({
        id: 'some-id',
        ...playerData,
      }),
    };

    (mockModel.create as jest.Mock).mockResolvedValue(savedPlayer);

    const result = await repository.save(playerData);

    expect(result).toEqual({
      id: 'some-id',
      ...playerData,
    });
    expect(mockModel.create).toHaveBeenCalledWith(playerData);
    expect(savedPlayer.toObject).toHaveBeenCalled();
  });

  it('deve buscar o jogador pelo id', async () => {
    const player = new Player({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });
    jest.spyOn(mockModel, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValue(player),
    } as any);

    expect(await repository.findById('1')).toEqual(player);
    expect(mockModel.findById).toHaveBeenCalledWith('1');
  });

  it('deve retornar nulo quando não achar o jogador pelo id', async () => {
    jest.spyOn(mockModel, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    expect(await repository.findById('1')).toBeNull();
    expect(mockModel.findById).toHaveBeenCalledWith('1');
  });
  it('deve procurar o jogador pelo email', async () => {
    const player = new Player({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });
    jest.spyOn(mockModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(player),
    } as any);

    expect(await repository.findByEmail('test@example.com')).toEqual(player);
    expect(mockModel.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });

  it('deve retornar nulo quando não encontrar o jogador pelo email', async () => {
    jest.spyOn(mockModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    expect(await repository.findByEmail('test@example.com')).toBeNull();
    expect(mockModel.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });

  it('deve atualizar o jogador', async () => {
    const player = new Player({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });
    jest.spyOn(mockModel, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValue(player),
    } as any);

    expect(await repository.update('1', { name: 'Updated Name' })).toEqual(
      player,
    );
    expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      { name: 'Updated Name' },
      { new: true },
    );
  });
});
