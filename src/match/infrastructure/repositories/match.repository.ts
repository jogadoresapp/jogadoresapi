import { InjectRepository } from '@nestjs/typeorm';
import { Match } from '../../domain/entities/match.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

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
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, match: Partial<Match>): Promise<Match> {
    await this.repository.update(id, match);
    return this.findById(id);
  }
}
