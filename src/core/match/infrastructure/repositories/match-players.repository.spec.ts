import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MatchPlayersRepository } from './match-players.repository';
import { MatchPlayers } from '../../domain/entities/match-player.entity';

describe('MatchPlayersRepository', () => {
  let repository: MatchPlayersRepository;
  let mockRepository: Repository<MatchPlayers>;
  let mockDataSource: DataSource;

  const matchId = 'match-id-1';
  const playerId = 'player-id-1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchPlayersRepository,
        {
          provide: getRepositoryToken(MatchPlayers),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MatchPlayersRepository>(MatchPlayersRepository);
    mockRepository = module.get<Repository<MatchPlayers>>(
      getRepositoryToken(MatchPlayers),
    );
    mockDataSource = module.get<DataSource>(DataSource);
  });

  it('deve ser instanciadada a service', () => {
    expect(repository).toBeDefined();
  });

  it('deve salvar os jogadores da partida', async () => {
    const matchPlayers = new MatchPlayers(matchId, playerId);
    jest.spyOn(mockRepository, 'save').mockResolvedValue(matchPlayers);

    const result = await repository.save(matchPlayers);
    expect(result).toEqual(matchPlayers);
    expect(mockRepository.save).toHaveBeenCalledWith(matchPlayers);
  });

  it('deve encontrar os jogadores da partida pelo ID da partida', async () => {
    const matchPlayers = new MatchPlayers(matchId, playerId);
    jest.spyOn(mockRepository, 'findOne').mockResolvedValue(matchPlayers);

    const result = await repository.findById('match-id-1');
    expect(result).toEqual(matchPlayers);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { matchId: 'match-id-1' },
    });
  });

  it('deve encontrar os jogadores da partida pelo ID do jogador', async () => {
    const matchPlayers = new MatchPlayers(matchId, playerId);
    jest.spyOn(mockRepository, 'findOne').mockResolvedValue(matchPlayers);

    const result = await repository.findByPlayerId('player-id-1');
    expect(result).toEqual(matchPlayers);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { playerId: 'player-id-1' },
    });
  });

  it('deve deletar os jogadores da partida pelo ID da partida', async () => {
    jest.spyOn(mockDataSource, 'query').mockResolvedValue(undefined);

    await repository.delete('match-id-1');
    expect(mockDataSource.query).toHaveBeenCalledWith(
      'DELETE FROM match_players WHERE match_id = $1',
      ['match-id-1'],
    );
  });

  it('deve obter os jogadores da partida', async () => {
    const players = [{ id: 'player-id-1', name: 'John Doe' }];
    jest.spyOn(mockDataSource, 'query').mockResolvedValue(players);

    const result = await repository.getPlayersFromMatch('match-id-1');
    expect(result).toEqual(players);
    expect(mockDataSource.query).toHaveBeenCalledWith(expect.any(String), [
      'match-id-1',
    ]);
  });

  it('deve obter as partidas do jogador', async () => {
    const matches = [{ id: 'match-id-1', location: 'Location' }];
    jest.spyOn(mockDataSource, 'query').mockResolvedValue(matches);

    const result = await repository.getMatchesFromPlayer('player-id-1');
    expect(result).toEqual(matches);
    expect(mockDataSource.query).toHaveBeenCalledWith(expect.any(String), [
      'player-id-1',
    ]);
  });
});
