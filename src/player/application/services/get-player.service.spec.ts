import { Test, TestingModule } from '@nestjs/testing';
import { GetPlayerService } from './get-player.service';
import { PlayerRepository } from '../../infraestructure/repositories/player.repository';

describe('GetPlayerService', () => {
  let service: GetPlayerService;
  let playerRepository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPlayerService,
        {
          provide: PlayerRepository,
          useValue: {
            // Mock implementation of PlayerRepository methods if needed
          },
        },
      ],
    }).compile();

    service = module.get<GetPlayerService>(GetPlayerService);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have playerRepository defined', () => {
    expect(service['playerRepository']).toBeDefined();
    expect(service['playerRepository']).toBe(playerRepository);
  });
});
