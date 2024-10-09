import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { GetAllMatchesUseCase } from '../use-cases/get-all-matches.use-case';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { Injectable } from '@nestjs/common';
import { Match } from '../../domain/entities/match.entity';

@Injectable()
export class GetAllMatchesService implements GetAllMatchesUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(status: STATUS_MATCH): Promise<Match[]> {
    return this.matchRepository.findAllByStatus(status);
  }
}
