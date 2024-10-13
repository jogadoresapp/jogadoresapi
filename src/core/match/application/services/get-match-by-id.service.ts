import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { Injectable } from '@nestjs/common';
import { Match } from '../../domain/entities/match.entity';
import { validateExistence } from 'src/common/helpers/validation.helper';

@Injectable()
export class GetMatchByIdService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(id: string): Promise<Match> {
    const matches = await this.matchRepository.findById(id);

    validateExistence(matches, 'Partida', id);

    return matches;
  }
}
