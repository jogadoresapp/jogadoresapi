import { Injectable, NotFoundException } from '@nestjs/common';
import { Player } from '../../../player/domain/entitites/player.entity';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';

@Injectable()
export class GetPlayersFromMatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchPlayerRepository: MatchPlayersRepository,
  ) {}

  async execute(matchId: string): Promise<Player[]> {
    const match = await this.matchRepository.findById(matchId);

    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }

    return await this.matchPlayerRepository.getPlayersFromMatch(match.getId());
  }
}
