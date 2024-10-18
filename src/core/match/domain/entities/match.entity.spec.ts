import { Match } from './match.entity';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

describe('Match Entity', () => {
  let createCommand: CreateMatchCommand;

  beforeEach(() => {
    createCommand = new CreateMatchCommand();
    createCommand.date = new Date();
    createCommand.playerId = 'player-id';
    createCommand.location = 'location';
    createCommand.teamLevel = TEAM_LEVEL.AVANCADO;
    createCommand.availableSpots = 10;
    createCommand.city = 'city';
    createCommand.state = 'state';
  });

  it('deve criar uma nova partida', () => {
    const match = Match.newMatch(createCommand);
    match.id = 'match-id';
    expect(match.id).toBeDefined();
    expect(match.date).toEqual(createCommand.date);
    expect(match.playerId).toEqual(createCommand.playerId);
    expect(match.location).toEqual(createCommand.location);
    expect(match.teamLevel).toEqual(createCommand.teamLevel);
    expect(match.availableSpots).toEqual(createCommand.availableSpots);
    expect(match.status).toEqual(STATUS_MATCH.A_REALIZAR);
    expect(match.sport).toEqual(SPORTS.FUTEBOL);
    expect(match.city).toEqual(createCommand.city);
    expect(match.state).toEqual(createCommand.state);
    expect(match.players).toEqual([]);
  });

  it('deve atualizar uma partida', () => {
    const match = Match.newMatch(createCommand);
    const editCommand = new EditMatchCommand();
    editCommand.dateGame = new Date('2023-01-01');
    editCommand.location = 'new-location';
    editCommand.availableSpots = 5;

    match.updateMatch(editCommand);

    expect(match.date).toEqual(editCommand.dateGame);
    expect(match.location).toEqual(editCommand.location);
    expect(match.availableSpots).toEqual(editCommand.availableSpots);
  });

  it('deve atualizar apenas os campos fornecidos', () => {
    const match = Match.newMatch(createCommand);
    const originalDate = match.date;
    const editCommand = new EditMatchCommand();
    editCommand.location = 'new-location';

    match.updateMatch(editCommand);

    expect(match.date).toEqual(originalDate);
    expect(match.location).toEqual(editCommand.location);
    expect(match.availableSpots).toEqual(createCommand.availableSpots);
  });

  it('deve cancelar uma partida', () => {
    const match = Match.newMatch(createCommand);
    match.cancelMatch();
    expect(match.status).toEqual(STATUS_MATCH.CANCELADA);
  });

  it('deve incrementar as vagas disponíveis', () => {
    const match = Match.newMatch(createCommand);
    const initialSpots = match.availableSpots;
    match.plusOneSpot();
    expect(match.availableSpots).toEqual(initialSpots + 1);
  });

  it('deve decrementar as vagas disponíveis', () => {
    const match = Match.newMatch(createCommand);
    const initialSpots = match.availableSpots;
    match.minusOneSpot();
    expect(match.availableSpots).toEqual(initialSpots - 1);
  });

  it('deve adicionar um jogador à partida', () => {
    const match = Match.newMatch(createCommand);
    const newPlayerId = 'new-player-id';
    const initialSpots = match.availableSpots;

    match.addPlayer(newPlayerId);

    expect(match.players).toContain(newPlayerId);
    expect(match.availableSpots).toEqual(initialSpots - 1);
  });

  it('não deve adicionar o mesmo jogador duas vezes', () => {
    const match = Match.newMatch(createCommand);
    const newPlayerId = 'new-player-id';

    match.addPlayer(newPlayerId);
    match.addPlayer(newPlayerId);

    expect(match.players.filter((id) => id === newPlayerId).length).toBe(1);
    expect(match.availableSpots).toEqual(createCommand.availableSpots - 1);
  });

  it('deve remover um jogador da partida', () => {
    const match = Match.newMatch(createCommand);
    const newPlayerId = 'new-player-id';
    match.addPlayer(newPlayerId);
    const spotsAfterAdding = match.availableSpots;

    match.removePlayer(newPlayerId);

    expect(match.players).not.toContain(newPlayerId);
    expect(match.availableSpots).toEqual(spotsAfterAdding + 1);
  });

  it('não deve alterar as vagas se tentar remover um jogador que não está na partida', () => {
    const match = Match.newMatch(createCommand);
    const initialSpots = match.availableSpots;

    match.removePlayer('non-existent-player');

    expect(match.availableSpots).toEqual(initialSpots);
  });

  it('deve permitir atualizar para 0 vagas disponíveis', () => {
    const match = Match.newMatch(createCommand);
    const editCommand = new EditMatchCommand();
    editCommand.availableSpots = 0;

    match.updateMatch(editCommand);

    expect(match.availableSpots).toEqual(0);
  });

  it('não deve permitir atualizar para um número negativo de vagas', () => {
    const match = Match.newMatch(createCommand);
    const editCommand = new EditMatchCommand();
    editCommand.availableSpots = -1;

    match.updateMatch(editCommand);

    expect(match.availableSpots).toEqual(createCommand.availableSpots);
  });
});
