import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { Match } from '../../domain/entities/match.entity';
import { PlayerRepository } from 'src/core/player/infraestructure/repositories/player.repository';
import { GetMatchesFromPlayer } from '../use-cases/get-matches-from-player.use-case';

@Injectable()
export class GetMatchesFromPlayerhService implements GetMatchesFromPlayer {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly matchPlayerRepository: MatchPlayersRepository,
  ) {}

  async execute(matchId: string): Promise<Match[]> {
    const match = await this.playerRepository.findById(matchId);

    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }

    return await this.matchPlayerRepository.getMatchesFromPlayer(match.id);
  }
}
