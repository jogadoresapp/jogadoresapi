import { Test, TestingModule } from '@nestjs/testing';
import { LeaveMatchService } from './leave-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { MatchCommand } from '../commands/match.command';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from '../../../../common/validators/match.validators';

jest.mock('../../infrastructure/repositories/match.repository');
jest.mock('../../infrastructure/repositories/match-players.repository');
jest.mock('../../../../common/helpers/validation.helper');
jest.mock('../../../../common/validators/match.validators');

describe('LeaveMatchService', () => {
  let service: LeaveMatchService;
  let matchRepository: MatchRepository;
  let matchPlayerRepository: MatchPlayersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveMatchService, MatchRepository, MatchPlayersRepository],
    }).compile();

    service = module.get<LeaveMatchService>(LeaveMatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    matchPlayerRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
  });

  it('deve construir a service', () => {
    expect(service).toBeDefined();
  });

  it('deve executar a service com sucesso', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' as any };
    const match = {
      getId: jest.fn().mockReturnValue('1'),
      plusOneSpot: jest.fn(),
    };

    matchRepository.findById = jest.fn().mockResolvedValue(match);
    matchPlayerRepository.delete = jest.fn();
    matchRepository.update = jest.fn();

    await service.execute(command);

    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(validateExistence).toHaveBeenCalledWith(
      match,
      'Partida',
      command.matchId,
    );
    expect(validateMatch).toHaveBeenCalledWith(match, match, command.playerId);
    expect(matchPlayerRepository.delete).toHaveBeenCalledWith(command.matchId);
    expect(match.plusOneSpot).toHaveBeenCalled();
    expect(matchRepository.update).toHaveBeenCalledWith(match.getId(), match);
  });

  it('deve lançar execption ao não encontrar uma partida', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' as any };

    matchRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(service.execute(command)).rejects.toThrow();
    expect(validateExistence).toHaveBeenCalledWith(
      null,
      'Partida',
      command.matchId,
    );
  });
});
