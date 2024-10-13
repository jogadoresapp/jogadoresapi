// // src/match/domain/tests/match.entity.spec.ts

// import { Match } from '../entities/match.entity';
// import { CreateMatchCommand } from '../../application/commands/create-match.command';
// import { EditMatchCommand } from '../../application/commands/edit-match.command';
// import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
// import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';

// describe.only('Match Entity', () => {
//   let match: Match;
//   const playerId = 'player-id-1';
//   const command: CreateMatchCommand = {
//     dateGame: '2024-10-15T18:00:00Z',
//     playerId,
//     location: 'Test Location',
//     teamLevel: TEAM_LEVEL.INICIANTE,
//     availableSpots: 10,
//   };

//   beforeEach(() => {
//     match = Match.newMatch(command);
//   });

//   it('deve criar uma nova partida com parâmetros válidos', () => {
//     expect(match.getDateGame()).toBe(command.dateGame);
//     expect(match.getPlayerId()).toBe(command.playerId);
//     expect(match.getLocation()).toBe(command.location);
//     expect(match.getTeamLevel()).toBe(command.teamLevel);
//     expect(match.getAvailableSpots()).toBe(command.availableSpots);
//     expect(match.getStatus()).toBe(STATUS_MATCH.A_REALIZAR);
//   });

//   it('deve atualizar as propriedades da partida', () => {
//     const editCommand: EditMatchCommand = {
//       dateGame: '2024-10-16T18:00:00Z',
//       location: 'Updated Location',
//       availableSpots: 5,
//     };

//     match.updateMatch(editCommand);

//     expect(match.getDateGame()).toBe(editCommand.dateGame);
//     expect(match.getLocation()).toBe(editCommand.location);
//     expect(match.getAvailableSpots()).toBe(editCommand.availableSpots);
//   });

//   it('não deve atualizar dateGame se não for fornecido', () => {
//     const initialDateGame = match.getDateGame();
//     const editCommand: EditMatchCommand = {
//       location: 'New Location',
//       availableSpots: 5,
//     };

//     match.updateMatch(editCommand);

//     expect(match.getDateGame()).toBe(initialDateGame);
//   });

//   it('não deve atualizar availableSpots se o valor fornecido for negativo', () => {
//     const initialAvailableSpots = match.getAvailableSpots();
//     const editCommand: EditMatchCommand = {
//       availableSpots: -5,
//     };

//     match.updateMatch(editCommand);

//     expect(match.getAvailableSpots()).toBe(initialAvailableSpots);
//   });

//   it('deve permitir atualizar a localização', () => {
//     const newLocation = 'New Location';
//     match.setLocation(newLocation);
//     expect(match.getLocation()).toBe(newLocation);
//   });

//   it('should allow updating available spots', () => {
//     const newAvailableSpots = 15;
//     match.setAvailableSpots(newAvailableSpots);
//     expect(match.getAvailableSpots()).toBe(newAvailableSpots);
//   });

//   it('deve permitir atualizar o status', () => {
//     const newStatus = STATUS_MATCH.CANCELADA;
//     match.setStatus(newStatus);
//     expect(match.getStatus()).toBe(newStatus);
//   });
// });
