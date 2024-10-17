import { Test, TestingModule } from '@nestjs/testing';
import { RegisterPlayerService } from './register-player.service';
import { PlayerRepository } from '../../infrastructure/repositories/player.repository';
import { RegisterPlayerCommand } from '../commands/register-player.command';
import * as bcrypt from 'bcryptjs';
import { Player } from '../../domain/entities/player.entity';

jest.mock('bcryptjs');
jest.mock('../../infrastructure/repositories/player.repository');

describe('RegisterPlayerService', () => {
  let service: RegisterPlayerService;
  let playerRepository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterPlayerService, PlayerRepository],
    }).compile();

    service = module.get<RegisterPlayerService>(RegisterPlayerService);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('deve criptografar a senha e salvar o jogador', async () => {
    const command = new RegisterPlayerCommand();
    command.name = 'John Doe';
    command.email = 'john@example.com';
    command.password = 'password123';
    const hashedPassword = 'hashedPassword123';
    const playerId = 'playerId123';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    (playerRepository.save as jest.Mock).mockResolvedValue({ id: playerId });

    const result = await service.execute(command);

    expect(bcrypt.hash).toHaveBeenCalledWith(command.password, 10);
    expect(playerRepository.save).toHaveBeenCalledWith(expect.any(Player));
    expect(result).toBe(playerId);
  });
});
