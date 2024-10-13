// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { MatchRepository } from './match.repository';
// import { Match } from '../../domain/entities/match.entity';
// import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
// import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
// import { CreateMatchCommand } from '../../application/commands/create-match.command';
// import { EditMatchCommand } from '../../application/commands/edit-match.command';

// describe('MatchRepository', () => {
//   let matchRepository: MatchRepository;
//   let repository: Repository<Match>;
//   let match: Match;
//   const playerId = 'player-id-1';
//   const command: CreateMatchCommand = {
//     dateGame: '2024-10-15T18:00:00Z',
//     playerId,
//     location: 'Test Location',
//     teamLevel: TEAM_LEVEL.INICIANTE,
//     availableSpots: 10,
//   };

//   const commandEdit: EditMatchCommand = {
//     dateGame: '2024-10-15T18:00:00Z',
//     location: 'New Location',
//     availableSpots: 10,
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         MatchRepository,
//         {
//           provide: getRepositoryToken(Match),
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     matchRepository = module.get<MatchRepository>(MatchRepository);
//     repository = module.get<Repository<Match>>(getRepositoryToken(Match));
//     match = Match.newMatch(command);
//     match.setId('1');
//   });

//   describe('findById', () => {
//     it('deve retornar uma partida quando encontrada', async () => {
//       jest.spyOn(repository, 'findOne').mockResolvedValue(match);

//       const result = await matchRepository.findById(playerId);
//       expect(result).toEqual(match);
//     });

//     it('deve retornar nulo quando nenhuma partida for encontrada', async () => {
//       const id = '1';
//       jest.spyOn(repository, 'findOne').mockResolvedValue(null);

//       const result = await matchRepository.findById(id);
//       expect(result).toBeNull();
//     });
//     describe('save', () => {
//       it('deve salvar e retornar a partida', async () => {
//         jest.spyOn(repository, 'save').mockResolvedValue(match);

//         const result = await matchRepository.save(match);
//         expect(result).toEqual(match);
//       });
//     });

//     describe('findAllByStatus', () => {
//       it('deve retornar as partidas com o status fornecido', async () => {
//         const status = STATUS_MATCH.A_REALIZAR;
//         const matches = [Match.newMatch(command)];
//         jest.spyOn(repository, 'find').mockResolvedValue(matches);

//         const result = await matchRepository.findAllByStatus(status);
//         expect(result).toEqual(matches);
//       });
//     });

//     describe('findAllById', () => {
//       it('deve retornar as partidas com os IDs fornecidos', async () => {
//         const ids = ['1'];

//         jest.spyOn(repository, 'findByIds').mockResolvedValue([match]);

//         const result = await matchRepository.findAllById(ids);
//         expect(result).toEqual([match]);
//       });
//     });

//     describe('update', () => {
//       it('deve atualizar e retornar a partida', async () => {
//         const updatedMatch = match.updateMatch(commandEdit);

//         jest.spyOn(repository, 'update').mockResolvedValue(undefined);
//         jest
//           .spyOn(repository, 'findOne')
//           .mockResolvedValue(updatedMatch as any);

//         const result = await matchRepository.update(match.getId(), {});
//         expect(result).toEqual(updatedMatch);
//       });
//     });
//   });
// });
