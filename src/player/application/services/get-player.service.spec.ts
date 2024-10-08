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
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GetPlayerService>(GetPlayerService);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('deve estar definido service getPlayer', () => {
    expect(service).toBeDefined();
  });

  it('deve ter o playerRepository definido', () => {
    expect(service['playerRepository']).toBeDefined();
    expect(service['playerRepository']).toBe(playerRepository);
  });
});
