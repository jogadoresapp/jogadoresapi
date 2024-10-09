import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { Match } from '../../domain/entities/match.entity';

Injectable();
export class MatchRepository {
  constructor(
    @InjectRepository(Match)
    private readonly repository: Repository<Match>,
  ) {}

  async save(match: Match): Promise<Match> {
    return this.repository.save(match);
  }

  async findAllByStatus(status: STATUS_MATCH): Promise<Match[]> {
    return this.repository.find({ where: { status } });
  }

  async findAllById(ids: string[]): Promise<Match[]> {
    return this.repository.findByIds(ids);
  }

  async findById(id: string): Promise<Match | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, match: Partial<Match>): Promise<Match> {
    await this.repository.update(id, match);
    return this.findById(id);
  }
}
