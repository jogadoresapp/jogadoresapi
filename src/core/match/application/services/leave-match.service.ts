import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchUseCase } from '../use-cases/match.use-case';
import { MatchCommand } from '../commands/match.command';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from '../../../../common/validators/match.validators';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';

@Injectable()
export class LeaveMatchService implements MatchUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchPlayerRepository: MatchPlayersRepository,
  ) {}

  async execute(command: MatchCommand): Promise<void> {
    const match = await this.matchRepository.findById(command.matchId);

    validateExistence(match, 'Partida', command.matchId);

    validateMatch(match, match, command.playerId);

    this.matchPlayerRepository.delete(command.matchId);

    match.plusOneSpot();

    await this.matchRepository.update(match.getId(), match);
  }
}
