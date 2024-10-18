import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JoinMatchService } from './join-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchCommand } from '../commands/match.command';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from '../../../../common/validators/match.validators';

jest.mock('../../infrastructure/repositories/match.repository');
jest.mock('../../../../common/helpers/validation.helper');
jest.mock('../../../../common/validators/match.validators');

describe('JoinMatchService', () => {
  let service: JoinMatchService;
  let matchRepository: jest.Mocked<MatchRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinMatchService, MatchRepository],
    }).compile();

    service = module.get<JoinMatchService>(JoinMatchService);
    matchRepository = module.get(MatchRepository);
  });

  it('deve construir a service', () => {
    expect(service).toBeDefined();
  });

  it('deve se juntar a partida com sucesso', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' };
    const match = {
      id: '1',
      availableSpots: 1,
      players: [],
      minusOneSpot: jest.fn(),
    };

    matchRepository.findById.mockResolvedValue(match as any);
    matchRepository.addPlayerToMatch.mockResolvedValue(match as any);
    matchRepository.update.mockResolvedValue(match as any);

    await service.execute(command);

    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(validateExistence).toHaveBeenCalledWith(
      match,
      'Partida',
      command.matchId,
    );
    expect(validateMatch).toHaveBeenCalledWith(match, match, command.playerId);
    expect(matchRepository.addPlayerToMatch).toHaveBeenCalledWith(
      command.matchId,
      command.playerId,
    );
    expect(match.minusOneSpot).toHaveBeenCalled();
    expect(matchRepository.update).toHaveBeenCalledWith(match.id, match);
  });

  it('deve lançar BadRequestException se a partida estiver lotada', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' };
    const match = {
      id: '1',
      availableSpots: 0,
      players: [],
    };

    matchRepository.findById.mockResolvedValue(match as any);

    await expect(service.execute(command)).rejects.toThrow(BadRequestException);
    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(validateExistence).toHaveBeenCalledWith(
      match,
      'Partida',
      command.matchId,
    );
    expect(validateMatch).toHaveBeenCalledWith(match, match, command.playerId);
    expect(matchRepository.addPlayerToMatch).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException se o jogador já estiver na partida', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' };
    const match = {
      id: '1',
      availableSpots: 1,
      players: ['player1'],
    };

    matchRepository.findById.mockResolvedValue(match as any);

    await expect(service.execute(command)).rejects.toThrow(BadRequestException);
    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(validateExistence).toHaveBeenCalledWith(
      match,
      'Partida',
      command.matchId,
    );
    expect(validateMatch).toHaveBeenCalledWith(match, match, command.playerId);
    expect(matchRepository.addPlayerToMatch).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException se falhar ao adicionar o jogador à partida', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' };
    const match = {
      id: '1',
      availableSpots: 1,
      players: [],
    };

    matchRepository.findById.mockResolvedValue(match as any);
    matchRepository.addPlayerToMatch.mockResolvedValue(null);

    await expect(service.execute(command)).rejects.toThrow(BadRequestException);
    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(validateExistence).toHaveBeenCalledWith(
      match,
      'Partida',
      command.matchId,
    );
    expect(validateMatch).toHaveBeenCalledWith(match, match, command.playerId);
    expect(matchRepository.addPlayerToMatch).toHaveBeenCalledWith(
      command.matchId,
      command.playerId,
    );
    expect(matchRepository.update).not.toHaveBeenCalled();
  });
});
