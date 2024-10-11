import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfirmMatchService } from './confirm-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { Match } from '../../domain/entities/match.entity';
import { ConfirmMatchCommand } from '../commands/confirm-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { CreateMatchCommand } from '../commands/create-match.command';
import { MatchPlayers } from '../../domain/entities/match-player.entity';

describe('ConfirmMatchService', () => {
  let service: ConfirmMatchService;
  let matchRepository: MatchRepository;
  let matchPlayersRepository: MatchPlayersRepository;

  let match: Match;
  const matchId = 'existing-id';
  const playerId = 'player-id-1';
  const command: ConfirmMatchCommand = {
    matchId,
    playerId,
  };

  const commandConfirm: CreateMatchCommand = {
    dateGame: '2024-10-15T18:00:00Z',
    playerId,
    location: 'Test Location',
    teamLevel: TEAM_LEVEL.INICIANTE,
    availableSpots: 9,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmMatchService,
        {
          provide: MatchRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
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

    matchRepository = module.get<MatchRepository>(MatchRepository);
    matchPlayersRepository = module.get<MatchPlayersRepository>(
      MatchPlayersRepository,
    );
    service = module.get<ConfirmMatchService>(ConfirmMatchService);

    match = Match.newMatch(commandConfirm);
  });

  it('deve lançar NotFoundException se a partida não for encontrada', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute(command)).rejects.toThrow(
      new NotFoundException('Partida com ID existing-id não encontrado'),
    );
  });

  it('deve confirmar jogador para a partida e atualizar os locais disponíveis', async () => {
    const matchPlayers = new MatchPlayers(matchId);
    matchPlayers.addPendingRequest(playerId); // Adiciona o jogador como uma solicitação pendente
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(match);
    jest
      .spyOn(matchPlayersRepository, 'findByMatchId')
      .mockResolvedValue(matchPlayers);
    jest.spyOn(matchPlayersRepository, 'save').mockResolvedValue(null);
    jest.spyOn(matchRepository, 'update').mockResolvedValue(null);

    await service.execute(command);

    expect(matchPlayers.players).toContain(playerId);
    expect(matchPlayers.pendingRequests).not.toContain(playerId);
  });
});
