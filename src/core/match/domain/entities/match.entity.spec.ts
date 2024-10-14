import { Match } from './match.entity';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

describe('Match Entity', () => {
  it('deve criar uma nova partida', () => {
    const command = new CreateMatchCommand();
    command.date = new Date();
    command.playerId = 'player-id';
    command.location = 'location';
    command.teamLevel = TEAM_LEVEL.AVANCADO;
    command.availableSpots = 10;
    command.city = 'city';
    command.state = 'state';

    const match = Match.newMatch(command);

    expect(match.getDateGame()).toEqual(command.date);
    expect(match.getPlayerId()).toEqual(command.playerId);
    expect(match.getLocation()).toEqual(command.location);
    expect(match.getTeamLevel()).toEqual(command.teamLevel);
    expect(match.getAvailableSpots()).toEqual(command.availableSpots);
    expect(match.getStatus()).toEqual(STATUS_MATCH.A_REALIZAR);
    expect(match.getSports()).toEqual(SPORTS.FUTEBOL);
    expect(match.getCity()).toEqual(command.city);
    expect(match.getState()).toEqual(command.state);
  });

  it('deve atualizar uma partida', () => {
    const command = new CreateMatchCommand();
    command.date = new Date();
    command.playerId = 'player-id';
    command.location = 'location';
    command.teamLevel = TEAM_LEVEL.AVANCADO;
    command.availableSpots = 10;
    command.city = 'city';
    command.state = 'state';

    const match = Match.newMatch(command);

    const editCommand = new EditMatchCommand();
    editCommand.dateGame = new Date();
    editCommand.location = 'new-location';
    editCommand.availableSpots = 5;

    match.updateMatch(editCommand);

    expect(match.getDateGame()).toEqual(editCommand.dateGame);
    expect(match.getLocation()).toEqual(editCommand.location);
    expect(match.getAvailableSpots()).toEqual(editCommand.availableSpots);
  });

  it('deve cancelar uma partida', () => {
    const command = new CreateMatchCommand();
    command.date = new Date();
    command.playerId = 'player-id';
    command.location = 'location';
    command.teamLevel = TEAM_LEVEL.AVANCADO;
    command.availableSpots = 10;
    command.city = 'city';
    command.state = 'state';

    const match = Match.newMatch(command);
    match.cancelMatch();

    expect(match.getStatus()).toEqual(STATUS_MATCH.CANCELADA);
  });

  it('deve incrementar as vagas disponíveis', () => {
    const command = new CreateMatchCommand();
    command.date = new Date();
    command.playerId = 'player-id';
    command.location = 'location';
    command.teamLevel = TEAM_LEVEL.AVANCADO;
    command.availableSpots = 10;
    command.city = 'city';
    command.state = 'state';

    const match = Match.newMatch(command);
    match.plusOneSpot();

    expect(match.getAvailableSpots()).toEqual(11);
  });

  it('deve decrementar as vagas disponíveis', () => {
    const command = new CreateMatchCommand();
    command.date = new Date();
    command.playerId = 'player-id';
    command.location = 'location';
    command.teamLevel = TEAM_LEVEL.AVANCADO;
    command.availableSpots = 10;
    command.city = 'city';
    command.state = 'state';

    const match = Match.newMatch(command);
    match.minusOneSpot();

    expect(match.getAvailableSpots()).toEqual(9);
  });
});
