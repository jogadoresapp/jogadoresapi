import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchPlayersRepository } from './match-players.repository';
import { MatchPlayers } from '../../domain/entities/match-player.entity';

describe('MatchPlayersRepository', () => {
  let repository: MatchPlayersRepository;
  let mockRepository: Repository<MatchPlayers>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchPlayersRepository,
        {
          provide: getRepositoryToken(MatchPlayers),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<MatchPlayersRepository>(MatchPlayersRepository);
    mockRepository = module.get<Repository<MatchPlayers>>(
      getRepositoryToken(MatchPlayers),
    );
  });

  it('should find match players by match ID', async () => {
    const matchId = 'match-id';
    const matchPlayers = new MatchPlayers(matchId);
    jest.spyOn(mockRepository, 'findOne').mockResolvedValue(matchPlayers);

    const result = await repository.findByMatchId(matchId);
    expect(result).toEqual(matchPlayers);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { matchId } });
  });

  it('should return new MatchPlayers if not found by match ID', async () => {
    const matchId = 'match-id';
    jest.spyOn(mockRepository, 'findOne').mockResolvedValue(undefined);

    const result = await repository.findByMatchId(matchId);
    expect(result).toEqual(new MatchPlayers(matchId));
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { matchId } });
  });

  it('should save match players', async () => {
    const matchPlayers = new MatchPlayers('match-id');
    jest.spyOn(mockRepository, 'save').mockResolvedValue(matchPlayers);

    const result = await repository.save(matchPlayers);
    expect(result).toEqual(matchPlayers);
    expect(mockRepository.save).toHaveBeenCalledWith(matchPlayers);
  });

  it('should find match IDs by player ID', async () => {
    const playerId = 'player-id';
    const matchPlayers1 = new MatchPlayers('match-id-1');
    matchPlayers1.players = [playerId];
    const matchPlayers2 = new MatchPlayers('match-id-2');
    matchPlayers2.pendingRequests = [playerId];
    jest
      .spyOn(mockRepository, 'find')
      .mockResolvedValue([matchPlayers1, matchPlayers2]);

    const result = await repository.findByPlayerId(playerId);
    expect(result).toEqual(['match-id-1', 'match-id-2']);
    expect(mockRepository.find).toHaveBeenCalled();
  });
});
