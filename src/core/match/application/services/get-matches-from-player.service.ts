import { Injectable, NotFoundException } from '@nestjs/common';
import { Match } from '../../domain/entities/match.entity';
import { PlayerRepository } from '../../../player/infrastructure/repositories/player.repository';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { GetMatchesFromPlayer } from '../use-cases/get-matches-from-player.use-case';

@Injectable()
export class GetMatchesFromPlayerService implements GetMatchesFromPlayer {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly matchRepository: MatchRepository,
  ) {}

  async execute(playerId: string): Promise<Match[]> {
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }

    return this.matchRepository.getMatchesFromPlayer(playerId);
  }
}
