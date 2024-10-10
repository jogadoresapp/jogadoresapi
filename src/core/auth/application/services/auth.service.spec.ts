import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PlayerRepository } from '../../../player/infraestructure/repositories/player.repository';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let playerRepository: PlayerRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PlayerRepository,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should have playerRepository defined', () => {
    expect(playerRepository).toBeDefined();
  });

  it('should have jwtService defined', () => {
    expect(jwtService).toBeDefined();
  });
});
