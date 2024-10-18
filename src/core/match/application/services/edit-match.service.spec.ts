import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EditMatchService } from './edit-match.service';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { EditMatchCommand } from '../commands/edit-match.command';
import { Match } from '../../domain/entities/match.entity';
import { CreateMatchCommand } from '../commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

describe('EditMatchService', () => {
  let service: EditMatchService;
  let matchRepository: MatchRepository;
  let match: Match;

  const matchId = 'existing-id';

  const command: EditMatchCommand = {
    location: 'New Location',
    availableSpots: 10,
  };

  const commandNew: CreateMatchCommand = {
    date: new Date(),
    playerId: '123e4567-e89b-12d3-a456-426614174000',
    location: 'Estrela da Vila Baummer',
    teamLevel: TEAM_LEVEL.AVANCADO,
    availableSpots: 10,
    city: 'city',
    state: 'state',
    sport: SPORTS.FUTEBOL,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditMatchService,
        {
          provide: MatchRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EditMatchService>(EditMatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
    match = Match.newMatch(commandNew);
    match.id = matchId;
  });

  it('deve lançar NotFoundException se a partida não for encontrada.', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(null);

    await expect(service.execute(matchId, command)).rejects.toThrow(
      new NotFoundException('Partida com ID existing-id não encontrado'),
    );
  });

  it('deve atualizar a partida e retornar void.', async () => {
    jest.spyOn(matchRepository, 'findById').mockResolvedValue(match);
    jest.spyOn(matchRepository, 'update').mockResolvedValue(null);
    jest.spyOn(match, 'updateMatch').mockImplementation(jest.fn());

    await service.execute(matchId, command);

    expect(matchRepository.findById).toHaveBeenCalledWith(matchId);
    expect(match.updateMatch).toHaveBeenCalledWith(command);
    expect(matchRepository.update).toHaveBeenCalledWith(matchId, match);
  });
});
