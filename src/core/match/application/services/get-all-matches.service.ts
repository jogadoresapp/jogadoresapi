import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { GetAllMatchesUseCase } from '../use-cases/get-all-matches.use-case';
import { Match } from '../../domain/entities/match.entity';
import { GetAllMatchesCommand } from '../commands/get-all-matches.command';

@Injectable()
export class GetAllMatchesService implements GetAllMatchesUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(query: GetAllMatchesCommand): Promise<Match[]> {
    return this.matchRepository.findAllByFilters(query);
  }
}
