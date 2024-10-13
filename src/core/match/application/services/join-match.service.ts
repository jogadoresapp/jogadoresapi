import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';

import { MatchUseCase } from '../use-cases/match.use-case';
import { MatchCommand } from '../commands/match.command';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from '../../../../common/validators/match.validators';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';

@Injectable()
export class JoinMatchService implements MatchUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchPlayerRepository: MatchPlayersRepository,
  ) {}

  async execute(command: MatchCommand): Promise<void> {
    const match = await this.matchRepository.findById(command.matchId);

    validateExistence(match, 'Partida', command.matchId);

    validateMatch(match, match, command.playerId);

    if (match.getAvailableSpots() === 0) {
      throw new BadRequestException('Partida já está cheia');
    }

    match.addPlayer(command.playerId);

    match.minusOneSpot();

    await this.matchRepository.update(match.getId(), match);
  }
}
