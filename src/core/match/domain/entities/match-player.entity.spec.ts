import { MatchPlayers } from './match-player.entity';

describe('MatchPlayers Entity', () => {
  it('deve criar uma nova instância de MatchPlayers', () => {
    const matchId = 'match-id';
    const playerId = 'player-id';

    const matchPlayer = MatchPlayers.create(matchId, playerId);

    expect(matchPlayer.getMatchId()).toEqual(matchId);
    expect(matchPlayer.getPlayerId()).toEqual(playerId);
  });

  it('deve definir e obter o matchId', () => {
    const matchId = 'match-id';
    const playerId = 'player-id';

    const matchPlayer = MatchPlayers.create(matchId, playerId);
    const newMatchId = 'new-match-id';
    matchPlayer.setMatchId(newMatchId);

    expect(matchPlayer.getMatchId()).toEqual(newMatchId);
  });

  it('deve definir e obter o playerId', () => {
    const matchId = 'match-id';
    const playerId = 'player-id';

    const matchPlayer = MatchPlayers.create(matchId, playerId);
    const newPlayerId = 'new-player-id';
    matchPlayer.setPlayerId(newPlayerId);

    expect(matchPlayer.getPlayerId()).toEqual(newPlayerId);
  });
});
