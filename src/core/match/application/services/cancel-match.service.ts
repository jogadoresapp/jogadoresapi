import { ForbiddenException, Injectable } from '@nestjs/common';
import { CancelMatchUseCase } from '../use-cases/cancel-match.use-case';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { validateExistence } from '../../../../common/helpers/validation.helper';

@Injectable()
export class CancelMatchService implements CancelMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(id: string): Promise<string> {
    const match = await this.matchRepository.findById(id);

    validateExistence(match, 'Match', id);

    this.validateCancellation(match.getStatus());

    match.setStatus(STATUS_MATCH.CANCELADA);
    await this.matchRepository.update(id, match);
    return match.getId();
  }

  private validateCancellation(status: STATUS_MATCH): void {
    if (status !== STATUS_MATCH.A_REALIZAR) {
      throw new ForbiddenException(
        'Apenas partidas com o status A_REALIZAR podem ser canceladas.',
      );
    }
  }
}
