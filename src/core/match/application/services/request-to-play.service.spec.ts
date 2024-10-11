import { Test, TestingModule } from '@nestjs/testing';
import { RequestToPlayMatchService } from '../services/request-to-play.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { ConfirmMatchCommand } from '../commands/confirm-match.command';
import { Match } from '../../domain/entities/match.entity';
import { CreateMatchCommand } from '../commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';

jest.mock('../../infrastructure/repositories/match.repository');
jest.mock('../../infrastructure/repositories/match-players.repository');
jest.mock('../../../../common/helpers/validation.helper');
jest.mock('../../../../common/validators/match.validators');
describe('RequestToPlayMatchService', () => {
  let service: RequestToPlayMatchService;
  let matchRepository: MatchRepository;
  let matchPlayersRepository: MatchPlayersRepository;
  let match: Match;
  const playerId = 'player-id-1';
  const command: CreateMatchCommand = {
    dateGame: '2024-10-15T18:00:00Z',
    playerId,
    location: 'Test Location',
    teamLevel: TEAM_LEVEL.INICIANTE,
    availableSpots: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestToPlayMatchService,
        {
          provide: MatchRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: MatchPlayersRepository,
          useValue: {
            findByMatchId: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    match = Match.newMatch(command);
    service = module.get<RequestToPlayMatchService>(RequestToPlayMatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    matchPlayersRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
  });

  it('deve solicitar com sucesso para jogar uma partida', async () => {
    const command: ConfirmMatchCommand = {
      matchId: 'match-id-1',
      playerId: 'player-id-2',
    };

    matchRepository.findById = jest.fn().mockResolvedValue(match);
    matchPlayersRepository.findByMatchId = jest.fn().mockResolvedValue({
      addPendingRequest: jest.fn(),
    });

    await service.execute(command);

    expect(matchRepository.findById).toHaveBeenCalledWith(command.matchId);
    expect(matchPlayersRepository.findByMatchId).toHaveBeenCalledWith(
      command.matchId,
    );
    expect(matchPlayersRepository.save).toHaveBeenCalled();
  });
});
