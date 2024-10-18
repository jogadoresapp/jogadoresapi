import { Test, TestingModule } from '@nestjs/testing';
import { LeaveMatchService } from './leave-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchCommand } from '../commands/match.command';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from '../../../../common/validators/match.validators';

jest.mock('../../infrastructure/repositories/match.repository');
jest.mock('../../../../common/helpers/validation.helper');
jest.mock('../../../../common/validators/match.validators');

describe('LeaveMatchService', () => {
  let service: LeaveMatchService;
  let matchRepository: jest.Mocked<MatchRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveMatchService, MatchRepository],
    }).compile();

    service = module.get<LeaveMatchService>(LeaveMatchService);
    matchRepository = module.get(MatchRepository);
  });

  it('deve construir a service', () => {
    expect(service).toBeDefined();
  });

  it('deve executar a service com sucesso', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' };
    const match = {
      id: '1',
      plusOneSpot: jest.fn(),
    };

    matchRepository.findById.mockResolvedValue(match as any);
    matchRepository.removePlayerFromMatch.mockResolvedValue(match as any);
    matchRepository.update.mockResolvedValue(match as any);

    await service.execute(command);

    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(validateExistence).toHaveBeenCalledWith(
      match,
      'Partida',
      command.matchId,
    );
    expect(validateMatch).toHaveBeenCalledWith(match, match, command.playerId);
    expect(matchRepository.removePlayerFromMatch).toHaveBeenCalledWith(
      command.matchId,
      command.playerId,
    );
    expect(match.plusOneSpot).toHaveBeenCalled();
    expect(matchRepository.update).toHaveBeenCalledWith(match.id, match);
  });

  it('deve lançar exception ao não encontrar uma partida', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' };
    matchRepository.findById.mockResolvedValue(null);

    await expect(service.execute(command)).rejects.toThrow();
    expect(validateExistence).toHaveBeenCalledWith(
      null,
      'Partida',
      command.matchId,
    );
  });

  it('deve lançar exception se falhar ao remover o jogador da partida', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' };
    const match = {
      id: '1',
      plusOneSpot: jest.fn(),
    };

    matchRepository.findById.mockResolvedValue(match as any);
    matchRepository.removePlayerFromMatch.mockResolvedValue(null);

    await expect(service.execute(command)).rejects.toThrow(
      'Falha ao remover jogador da partida',
    );
    expect(matchRepository.removePlayerFromMatch).toHaveBeenCalledWith(
      command.matchId,
      command.playerId,
    );
    expect(match.plusOneSpot).not.toHaveBeenCalled();
    expect(matchRepository.update).not.toHaveBeenCalled();
  });
});
