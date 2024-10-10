import { MatchPlayers } from './match-player.entity';

describe('MatchPlayers', () => {
  let matchPlayers: MatchPlayers;

  beforeEach(() => {
    matchPlayers = new MatchPlayers('match-1');
  });

  it('should initialize with empty players and pendingRequests arrays', () => {
    expect(matchPlayers.players).toEqual([]);
    expect(matchPlayers.pendingRequests).toEqual([]);
  });

  it('should add a player to the players array', () => {
    matchPlayers.addPlayer('player-1');
    expect(matchPlayers.players).toContain('player-1');
  });

  it('should not add a player to the players array if already present', () => {
    matchPlayers.addPlayer('player-1');
    matchPlayers.addPlayer('player-1');
    expect(matchPlayers.players).toEqual(['player-1']);
  });

  it('should remove a player from the players array', () => {
    matchPlayers.addPlayer('player-1');
    matchPlayers.removePlayer('player-1');
    expect(matchPlayers.players).not.toContain('player-1');
  });

  it('should add a pending request to the pendingRequests array', () => {
    matchPlayers.addPendingRequest('player-2');
    expect(matchPlayers.pendingRequests).toContain('player-2');
  });

  it('should not add a pending request to the pendingRequests array if already present', () => {
    matchPlayers.addPendingRequest('player-2');
    matchPlayers.addPendingRequest('player-2');
    expect(matchPlayers.pendingRequests).toEqual(['player-2']);
  });

  it('should remove a pending request from the pendingRequests array', () => {
    matchPlayers.addPendingRequest('player-2');
    matchPlayers.removePendingRequest('player-2');
    expect(matchPlayers.pendingRequests).not.toContain('player-2');
  });

  it('should return true if a player is in the match', () => {
    matchPlayers.addPlayer('player-1');
    expect(matchPlayers.isPlayerInMatch('player-1')).toBe(true);
  });

  it('should return false if a player is not in the match', () => {
    expect(matchPlayers.isPlayerInMatch('player-1')).toBe(false);
  });

  it('should return true if a player has requested to play', () => {
    matchPlayers.addPendingRequest('player-2');
    expect(matchPlayers.hasRequestedToPlay('player-2')).toBe(true);
  });

  it('should return false if a player has not requested to play', () => {
    expect(matchPlayers.hasRequestedToPlay('player-2')).toBe(false);
  });
});
