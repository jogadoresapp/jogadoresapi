import { Test, TestingModule } from '@nestjs/testing';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { Match } from '../../domain/entities/match.entity';
import { GetPlayerMatchesCommand } from '../commands/get-player-matches.command';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { GetMatchesByPlayerService } from './get-matches-by-player.service';

describe('GetPlayerMatchesService', () => {
  let service: GetMatchesByPlayerService;
  let matchRepository: MatchRepository;
  let matchPlayersRepository: MatchPlayersRepository;

  const playerId = 'player-id-1';
  const matchId = 'match-id-1';
  const command = new GetPlayerMatchesCommand(
    playerId,
    STATUS_MATCH.A_REALIZAR,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMatchesByPlayerService,
        {
          provide: MatchRepository,
          useValue: {
            findAllById: jest.fn(),
          },
        },
        {
          provide: MatchPlayersRepository,
          useValue: {
            findByPlayerId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetMatchesByPlayerService>(GetMatchesByPlayerService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    matchPlayersRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
  });

  it('deve retornar partidas para um ID de jogador e status válidos', async () => {
    const matches = [
      Match.newMatch({
        playerId,
        dateGame: '2024-10-15T18:00:00Z',
        location: 'Location 1',
        availableSpots: 10,
        teamLevel: TEAM_LEVEL.NORMAL,
      }),
    ];

    jest
      .spyOn(matchPlayersRepository, 'findByPlayerId')
      .mockResolvedValue([matchId]);
    jest.spyOn(matchRepository, 'findAllById').mockResolvedValue(matches);

    const result = await service.execute(command);

    expect(result).toEqual(matches);
    expect(matchPlayersRepository.findByPlayerId).toHaveBeenCalledWith(
      playerId,
    );
    expect(matchRepository.findAllById).toHaveBeenCalledWith([matchId]);
  });

  it('deve retornar um array vazio se nenhuma partida for encontrada', async () => {
    jest
      .spyOn(matchPlayersRepository, 'findByPlayerId')
      .mockResolvedValue([matchId]);
    jest.spyOn(matchRepository, 'findAllById').mockResolvedValue([]);

    const result = await service.execute(command);

    expect(result).toEqual([]);
    expect(matchPlayersRepository.findByPlayerId).toHaveBeenCalledWith(
      playerId,
    );
    expect(matchRepository.findAllById).toHaveBeenCalledWith([matchId]);
  });

  it('should throw an error if matchPlayersRepository throws an error', async () => {
    jest
      .spyOn(matchPlayersRepository, 'findByPlayerId')
      .mockRejectedValue(new Error('Database error'));

    await expect(service.execute(command)).rejects.toThrow('Database error');
  });

  it('deve lançar um erro se o matchPlayersRepository lançar um erro', async () => {
    jest
      .spyOn(matchPlayersRepository, 'findByPlayerId')
      .mockResolvedValue([matchId]);
    jest
      .spyOn(matchRepository, 'findAllById')
      .mockRejectedValue(new Error('Database error'));

    await expect(service.execute(command)).rejects.toThrow('Database error');
  });
});
