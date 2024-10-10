import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { EditMatchUseCase } from '../use-cases/edit-match.use-case';
import { EditMatchCommand } from '../commands/edit-match.command';
import { validateExistence } from '../../../../common/helpers/validation.helper';

@Injectable()
export class EditMatchService implements EditMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(id: string, command: EditMatchCommand): Promise<void> {
    const match = await this.matchRepository.findById(id);
    validateExistence(match, 'Match', id);

    match.updateMatch(command);

    await this.matchRepository.update(id, match);
  }
}
