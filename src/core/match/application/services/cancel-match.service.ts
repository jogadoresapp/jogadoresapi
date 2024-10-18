import { Injectable } from '@nestjs/common';
import { CancelMatchUseCase } from '../use-cases/cancel-match.use-case';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { validateExistence } from '../../../../common/helpers/validation.helper';

@Injectable()
export class CancelMatchService implements CancelMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(id: string): Promise<string> {
    const match = await this.matchRepository.findById(id);

    validateExistence(match, 'Partida', id);

    match.status = STATUS_MATCH.CANCELADA;
    await this.matchRepository.update(id, match);
    return match.id;
  }
}
