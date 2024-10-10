import { Injectable, NotFoundException } from '@nestjs/common';
import { PlayerRepository } from '../../../player/infraestructure/repositories/player.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { Player } from '../../../player/domain/entitites/player.entity';
import { GetMatchPlayesUseCase } from '../use-cases/get-players-matches.use-case';

@Injectable()
export class GetPlayersMatchesService implements GetMatchPlayesUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchPlayersRepository: MatchPlayersRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  async execute(matchId: string): Promise<Player[]> {
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    const matchPlayers =
      await this.matchPlayersRepository.findByMatchId(matchId);

    const playerIds = matchPlayers.players;

    const players = await this.playerRepository.findAllByIds(playerIds);

    return players;
  }
}
