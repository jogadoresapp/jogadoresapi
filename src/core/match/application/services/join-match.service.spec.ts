import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JoinMatchService } from './join-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { MatchCommand } from '../commands/match.command';
import { MatchPlayers } from '../../domain/entities/match-player.entity';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from '../../../../common/validators/match.validators';

jest.mock('../../infrastructure/repositories/match.repository');
jest.mock('../../infrastructure/repositories/match-players.repository');
jest.mock('../../../../common/helpers/validation.helper');
jest.mock('../../../../common/validators/match.validators');

describe('JoinMatchService', () => {
  let service: JoinMatchService;
  let matchRepository: MatchRepository;
  let matchPlayerRepository: MatchPlayersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinMatchService, MatchRepository, MatchPlayersRepository],
    }).compile();

    service = module.get<JoinMatchService>(JoinMatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    matchPlayerRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
  });

  it('deve construir a service', () => {
    expect(service).toBeDefined();
  });

  it('deve se juntar a partida com sucesso', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' as any };
    const match = {
      getId: jest.fn().mockReturnValue('1'),
      getAvailableSpots: jest.fn().mockReturnValue(1),
      minusOneSpot: jest.fn(),
    };

    matchRepository.findById = jest.fn().mockResolvedValue(match);
    matchPlayerRepository.save = jest.fn();
    matchRepository.update = jest.fn();

    await service.execute(command);

    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(validateExistence).toHaveBeenCalledWith(
      match,
      'Partida',
      command.matchId,
    );
    expect(validateMatch).toHaveBeenCalledWith(match, match, command.playerId);
    expect(match.getAvailableSpots).toHaveBeenCalled();
    expect(matchPlayerRepository.save).toHaveBeenCalledWith(
      expect.any(MatchPlayers),
    );
    expect(match.minusOneSpot).toHaveBeenCalled();
    expect(matchRepository.update).toHaveBeenCalledWith(match.getId(), match);
  });

  it('deve lançar BadRequestException se a partida estiver lotada', async () => {
    const command: MatchCommand = { matchId: '1', playerId: 'player1' as any };
    const match = {
      getId: jest.fn().mockReturnValue('1'),
      getAvailableSpots: jest.fn().mockReturnValue(0),
    };

    matchRepository.findById = jest.fn().mockResolvedValue(match);

    await expect(service.execute(command)).rejects.toThrow(BadRequestException);

    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(validateExistence).toHaveBeenCalledWith(
      match,
      'Partida',
      command.matchId,
    );
    expect(validateMatch).toHaveBeenCalledWith(match, match, command.playerId);
    expect(match.getAvailableSpots).toHaveBeenCalled();
  });
});
