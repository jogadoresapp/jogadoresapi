import { Injectable } from '@nestjs/common';
import { Player } from '../../../player/domain/entitites/player.entity';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';

@Injectable()
export class GetPlayersFromMatchService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(matchId: string): Promise<Player[]> {
    console.log(this.matchRepository);
    const match = await this.matchRepository.findById(matchId);

    return await this.matchRepository.getPlayersFromMatch(match.getId());
  }
}
