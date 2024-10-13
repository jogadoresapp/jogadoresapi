// import { Test, TestingModule } from '@nestjs/testing';
// import { GetAllMatchesService } from './get-all-matches.service';
// import { MatchRepository } from '../../infrastructure/repositories/match.repository';
// import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
// import { Match } from '../../domain/entities/match.entity';
// import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
// import { CreateMatchCommand } from '../commands/create-match.command';

// describe('GetAllMatchesService', () => {
//   let service: GetAllMatchesService;
//   let matchRepository: MatchRepository;
//   const command: CreateMatchCommand = {
//     dateGame: '2024-10-15T18:00:00Z',
//     playerId: '123e4567-e89b-12d3-a456-426614174000',
//     location: 'Estrela da Vila Baummer',
//     teamLevel: TEAM_LEVEL.AVANCADO,
//     availableSpots: 10,
//   };

//   const match = Match.newMatch(command);

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         GetAllMatchesService,
//         {
//           provide: MatchRepository,
//           useValue: {
//             findAllByStatus: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<GetAllMatchesService>(GetAllMatchesService);
//     matchRepository = module.get<MatchRepository>(MatchRepository);
//   });

//   it('deve retornar partidas para um status válido', async () => {
//     const status = STATUS_MATCH.A_REALIZAR;
//     const matches: Match[] = [match];

//     jest.spyOn(matchRepository, 'findAllByStatus').mockResolvedValue(matches);

//     const result = await service.execute(status);
//     expect(result).toEqual(matches);
//   });

//   it('deve retornar um array vazio se nenhuma partida for encontrada', async () => {
//     const status = STATUS_MATCH.A_REALIZAR;

//     jest.spyOn(matchRepository, 'findAllByStatus').mockResolvedValue([]);

//     const result = await service.execute(status);
//     expect(result).toEqual([]);
//   });

//   it('deve lançar um erro se o repositório lançar um erro.', async () => {
//     const status = STATUS_MATCH.A_REALIZAR;

//     jest
//       .spyOn(matchRepository, 'findAllByStatus')
//       .mockRejectedValue(new Error('Repository error'));

//     await expect(service.execute(status)).rejects.toThrow('Repository error');
//   });
// });
