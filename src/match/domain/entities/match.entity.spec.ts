import { Match } from './match.entity';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../common/enums/team-level.enum';

describe('Match Entity', () => {
  it('should create a Match instance with given parameters', () => {
    const id = 'match-id';
    const dateGame = '2023-10-10';
    const playerId = 'player-id';
    const location = 'location';
    const teamLevel = TEAM_LEVEL.AVANCADO;
    const availableSpots = 10;
    const status = STATUS_MATCH.A_REALIZAR;

    const match = new Match(
      id,
      dateGame,
      playerId,
      location,
      teamLevel,
      availableSpots,
      status,
    );

    expect(match.id).toBe(id);
    expect(match.dateGame).toBe(dateGame);
    expect(match.playerId).toBe(playerId);
    expect(match.location).toBe(location);
    expect(match.teamLevel).toBe(teamLevel);
    expect(match.availableSpots).toBe(availableSpots);
    expect(match.status).toBe(status);
  });

  it('should create a new Match instance using newMatch static method', () => {
    const command = {
      dateGame: '2023-10-10',
      playerId: 'player-id',
      location: 'location',
      teamLevel: TEAM_LEVEL.AVANCADO,
      availableSpots: 10,
    };

    const match = Match.newMatch(command);

    expect(match.id).toBeUndefined();
    expect(match.dateGame).toBe(command.dateGame);
    expect(match.playerId).toBe(command.playerId);
    expect(match.location).toBe(command.location);
    expect(match.teamLevel).toBe(command.teamLevel);
    expect(match.availableSpots).toBe(command.availableSpots);
    expect(match.status).toBe(STATUS_MATCH.A_REALIZAR);
  });
});
