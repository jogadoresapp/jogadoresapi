import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchPlayers } from '../../domain/entities/match-player.entity';

@Injectable()
export class MatchPlayersRepository {
  constructor(
    @InjectRepository(MatchPlayers)
    private readonly repository: Repository<MatchPlayers>,
  ) {}

  async findByMatchId(matchId: string): Promise<MatchPlayers> {
    const matchPlayers = await this.repository.findOne({ where: { matchId } });
    if (!matchPlayers) {
      return new MatchPlayers(matchId);
    }
    return matchPlayers;
  }

  async save(matchPlayers: MatchPlayers): Promise<MatchPlayers> {
    return this.repository.save(matchPlayers);
  }

  async findByPlayerId(playerId: string): Promise<string[]> {
    const matchPlayers = await this.repository.find();
    return matchPlayers
      .filter(
        (mp) =>
          mp.players.includes(playerId) ||
          mp.pendingRequests.includes(playerId),
      )
      .map((mp) => mp.matchId);
  }
}
