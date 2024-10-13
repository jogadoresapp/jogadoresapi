import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Match } from '../../domain/entities/match.entity';
import { GetAllMatchesCommand } from '../../application/commands/get-all-matches.command';

Injectable();
export class MatchRepository {
  constructor(
    @InjectRepository(Match)
    private readonly repository: Repository<Match>,
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

    if (filters.status) {
      queryBuilder.andWhere('match.status = :status', {
        status: filters.status,
      });
    }

    // if (filters.date) {
    //   queryBuilder.andWhere('match.date = :date', { date: filters.date });
    // }

    if (filters.sport) {
      queryBuilder.andWhere('match.sport = :sport', { sport: filters.sport });
    }

    if (filters.teamLevel) {
      queryBuilder.andWhere('match.team_level = :teamLevel', {
        teamLevel: filters.teamLevel,
      });
    }

    if (filters.city) {
      queryBuilder.andWhere('match.city = :city', { city: filters.city });
    }

    if (filters.state) {
      queryBuilder.andWhere('match.state = :state', { state: filters.state });
    }

    if (filters.playerId) {
      queryBuilder.andWhere('match.player_id = :playerId', {
        playerId: filters.playerId,
      });
    }

    return queryBuilder.getMany();
  }
}
