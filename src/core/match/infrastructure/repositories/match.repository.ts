import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Match } from '../../domain/entities/match.entity';
import { GetAllMatchesCommand } from '../../application/commands/get-all-matches.command';
import { Player } from '../../../player/domain/entitites/player.entity';

Injectable();
export class MatchRepository {
  constructor(
    @InjectRepository(Match)
    private readonly repository: Repository<Match>,
    private readonly dataSource: DataSource,
  ) {}

  async save(match: Match): Promise<Match> {
    return this.repository.save(match);
  }

  async findById(id: string): Promise<Match | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async update(id: string, match: Partial<Match>): Promise<Match> {
    await this.repository.update(id, match);
    return this.findById(id);
  }

  async findAllByFilters(filters: GetAllMatchesCommand): Promise<Match[]> {
    const queryBuilder = this.repository.createQueryBuilder('match');

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryBuilder.andWhere(`match.${key} = :${key}`, { [key]: value });
      }
    });

    return queryBuilder.getMany();
  }

  async getPlayersFromMatch(matchId: string): Promise<Player[]> {
    console.log(matchId);
    const query = `
      SELECT 
      p.id,
      p.name
      FROM players p
      LEFT JOIN match_players mp ON p.id = mp.player_id
      WHERE mp.match_id = $1
    `;

    const players = await this.dataSource.query(query, [matchId]);

    return players;
  }
}
