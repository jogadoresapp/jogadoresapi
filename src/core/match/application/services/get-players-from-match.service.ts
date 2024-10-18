import { Injectable, NotFoundException } from '@nestjs/common';
import { Player } from '../../../player/domain/entities/player.entity';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';

@Injectable()
export class GetPlayersFromMatchService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(matchId: string): Promise<Player[]> {
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new NotFoundException('Partida não encontrada');
    }

    return this.matchRepository.getPlayersFromMatch(matchId);
  }
}
