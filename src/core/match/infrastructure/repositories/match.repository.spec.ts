import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { MatchRepository } from './match.repository';
import { Match, MatchDocument } from '../../domain/entities/match.entity';
import { Player } from '../../../player/domain/entities/player.entity';
import { GetAllMatchesCommand } from '../../application/commands/get-all-matches.command';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { EditMatchCommand } from '../../application/commands/edit-match.command';

describe('MatchRepository', () => {
  let repository: MatchRepository;
  let matchModel: Model<MatchDocument>;
  let playerModel: Model<Player>;
  let createCommand: CreateMatchCommand;

  const editcommand: EditMatchCommand = {
    location: 'New Location',
    availableSpots: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchRepository,
        {
          provide: getModelToken(Match.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            find: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(Player.name),
          useValue: {
            find: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MatchRepository>(MatchRepository);
    matchModel = module.get<Model<MatchDocument>>(getModelToken(Match.name));
    playerModel = module.get<Model<Player>>(getModelToken(Player.name));
  });

  beforeEach(() => {
    createCommand = new CreateMatchCommand();
    createCommand.date = new Date();
    createCommand.playerId = 'player-id';
    createCommand.location = 'location';
    createCommand.teamLevel = TEAM_LEVEL.AVANCADO;
    createCommand.availableSpots = 10;
    createCommand.city = 'city';
    createCommand.state = 'state';
    createCommand.sport = SPORTS.FUTEBOL;
  });

  it('deve ser definido', () => {
    expect(repository).toBeDefined();
  });

  it('deve salvar uma partida', async () => {
    const dadosPartida = Match.newMatch(createCommand);
    const mockSalvar = jest.fn().mockResolvedValue(dadosPartida);
    (matchModel.create as jest.Mock).mockReturnValue({ save: mockSalvar });

    const resultado = await repository.save(dadosPartida);

    expect(matchModel.create).toHaveBeenCalledWith(dadosPartida);
    expect(mockSalvar).toHaveBeenCalled();
    expect(resultado).toEqual(dadosPartida);
  });

  it('deve encontrar uma partida por id', async () => {
    const idPartida = 'idTeste';
    const dadosPartida = Match.newMatch(createCommand);
    (matchModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(dadosPartida),
    });

    const resultado = await repository.findById(idPartida);

    expect(matchModel.findById).toHaveBeenCalledWith(idPartida);
    expect(resultado).toEqual(dadosPartida);
  });

  it('deve atualizar uma partida', async () => {
    const idPartida = 'idTeste';
    const dadosAtualizacao = Match.newMatch(createCommand);
    const partidaAtualizada = editcommand;
    (matchModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(partidaAtualizada),
    });

    const resultado = await repository.update(idPartida, dadosAtualizacao);

    expect(matchModel.findByIdAndUpdate).toHaveBeenCalledWith(
      idPartida,
      dadosAtualizacao,
      { new: true },
    );
    expect(resultado).toEqual(partidaAtualizada);
  });

  it('deve encontrar partidas por filtros', async () => {
    const filtros: GetAllMatchesCommand = {
      status: STATUS_MATCH.A_REALIZAR,
      sport: SPORTS.FUTEBOL,
    };
    const partidas = [Match.newMatch(createCommand)];
    (matchModel.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(partidas),
    });

    const resultado = await repository.findAllByFilters(filtros);

    expect(matchModel.find).toHaveBeenCalledWith({
      status: STATUS_MATCH.A_REALIZAR,
      sport: SPORTS.FUTEBOL,
    });
    expect(resultado).toEqual(partidas);
  });

  it('deve obter jogadores de uma partida', async () => {
    const idPartida = 'idTeste';
    const partidaMock = { players: ['jogador1', 'jogador2'] };
    const jogadoresMock = [{ id: 'jogador1' }, { id: 'jogador2' }];

    (matchModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(partidaMock),
    });
    (playerModel.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(jogadoresMock),
    });

    const resultado = await repository.getPlayersFromMatch(idPartida);

    expect(matchModel.findById).toHaveBeenCalledWith(idPartida);
    expect(playerModel.find).toHaveBeenCalledWith({
      _id: { $in: partidaMock.players },
    });
    expect(resultado).toEqual(jogadoresMock);
  });

  it('deve obter partidas de um jogador', async () => {
    const idJogador = 'idJogador';
    const partidasMock = [Match.newMatch(createCommand)];

    (matchModel.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(partidasMock),
    });

    const resultado = await repository.getMatchesFromPlayer(idJogador);

    expect(matchModel.find).toHaveBeenCalledWith({ players: idJogador });
    expect(resultado).toEqual(partidasMock);
  });

  it('deve adicionar um jogador a uma partida', async () => {
    const idPartida = 'idPartida';
    const idJogador = 'idJogador';
    const partidaAtualizada = Match.newMatch(createCommand);

    (matchModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(partidaAtualizada),
    });

    const resultado = await repository.addPlayerToMatch(idPartida, idJogador);

    expect(matchModel.findByIdAndUpdate).toHaveBeenCalledWith(
      idPartida,
      { $addToSet: { players: idJogador } },
      { new: true },
    );
    expect(resultado).toEqual(partidaAtualizada);
  });

  it('deve remover um jogador de uma partida', async () => {
    const idPartida = 'idPartida';
    const idJogador = 'idJogador';
    const partidaAtualizada = Match.newMatch(createCommand);

    (matchModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(partidaAtualizada),
    });

    const resultado = await repository.removePlayerFromMatch(
      idPartida,
      idJogador,
    );

    expect(matchModel.findByIdAndUpdate).toHaveBeenCalledWith(
      idPartida,
      { $pull: { players: idJogador } },
      { new: true },
    );
    expect(resultado).toEqual(partidaAtualizada);
  });
});
