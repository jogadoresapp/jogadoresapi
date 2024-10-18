import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { Injectable } from '@nestjs/common';
import { Match } from '../../domain/entities/match.entity';
import { validateExistence } from '../../../../common/helpers/validation.helper';

@Injectable()
export class GetMatchByIdService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(id: string): Promise<Match> {
    const match = await this.matchRepository.findById(id);

    validateExistence(match, 'Partida', id);

    return match;
  }
}
