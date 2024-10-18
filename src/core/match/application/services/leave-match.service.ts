import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchUseCase } from '../use-cases/match.use-case';
import { MatchCommand } from '../commands/match.command';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from '../../../../common/validators/match.validators';

@Injectable()
export class LeaveMatchService implements MatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(command: MatchCommand): Promise<void> {
    const match = await this.matchRepository.findById(command.matchId);
    validateExistence(match, 'Partida', command.matchId);
    validateMatch(match, match, command.playerId);

    const updatedMatch = await this.matchRepository.removePlayerFromMatch(
      command.matchId,
      command.playerId,
    );

    if (updatedMatch) {
      updatedMatch.plusOneSpot();
      await this.matchRepository.update(updatedMatch.id, updatedMatch);
    } else {
      throw new Error('Falha ao remover jogador da partida');
    }
  }
}
