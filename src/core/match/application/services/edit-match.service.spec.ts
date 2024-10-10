import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EditMatchService } from './edit-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { EditMatchCommand } from '../commands/edit-match.command';

describe('EditMatchService', () => {
  let service: EditMatchService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: MatchRepository;

  const mockMatchRepository = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditMatchService,
        { provide: MatchRepository, useValue: mockMatchRepository },
      ],
    }).compile();

    service = module.get<EditMatchService>(EditMatchService);
    repository = module.get<MatchRepository>(MatchRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if match is not found', async () => {
    mockMatchRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute('nonexistent-id', new EditMatchCommand()),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update match with new values', async () => {
    const match = {
      id: 'existing-id',
      dateGame: '2024-10-15T16:00:00Z',
      location: 'Old Location',
      availableSpots: 10,
    };

    const command = new EditMatchCommand();
    command.dateGame = '2024-10-15T18:00:00Z';
    command.location = 'New Location';
    command.availableSpots = 5;

    mockMatchRepository.findById.mockResolvedValue(match);

    await service.execute('existing-id', command);

    expect(mockMatchRepository.update).toHaveBeenCalledWith('existing-id', {
      ...match,
      dateGame: command.dateGame,
      location: command.location,
      availableSpots: command.availableSpots,
    });
  });

  it('should retain old values if new values are not provided', async () => {
    const match = {
      id: 'existing-id',
      dateGame: '2024-10-15T18:00:00Z',
      location: 'Old Location',
      availableSpots: 10,
    };

    const command = new EditMatchCommand();

    mockMatchRepository.findById.mockResolvedValue(match);

    await service.execute('existing-id', command);

    expect(mockMatchRepository.update).toHaveBeenCalledWith(
      'existing-id',
      match,
    );
  });
});
