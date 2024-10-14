import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MatchPlayers } from '../../domain/entities/match-player.entity';
import { Player } from 'src/core/player/domain/entities/player.entity';
import { Match } from '../../domain/entities/match.entity';

@Injectable()
export class MatchPlayersRepository {
  constructor(
    @InjectRepository(MatchPlayers)
    private readonly repository: Repository<MatchPlayers>,
    private readonly dataSource: DataSource,
  ) {}

  async save(matchPlayers: MatchPlayers): Promise<MatchPlayers> {
    return this.repository.save(matchPlayers);
  }

  async findById(matchId: string): Promise<MatchPlayers | null> {
    return this.repository.findOne({ where: { matchId } as any });
  }

  async findByPlayerId(playerId: string): Promise<MatchPlayers | null> {
    return this.repository.findOne({ where: { playerId } as any });
  }

  async delete(matchId: string): Promise<void> {
    const query = `DELETE FROM match_players WHERE match_id = $1`;
    await this.dataSource.query(query, [matchId]);
  }

  async getPlayersFromMatch(matchId: string): Promise<Player[]> {
    const query = `
      SELECT 
      p.id,
      p.name
      FROM player p
      JOIN match_players mp ON p.id = mp.player_id
      WHERE mp.match_id = $1
    `;

    const players = await this.dataSource.query(query, [matchId]);

    return players;
  }

  async getMatchesFromPlayer(playerId: string): Promise<Match[]> {
    const query = `
    SELECT 
      m.*
    FROM match m
    JOIN match_players mp ON m.id = mp.match_id
    WHERE mp.player_id = $1
  `;

    const matches = await this.dataSource.query(query, [playerId]);

    return matches;
  }
}
