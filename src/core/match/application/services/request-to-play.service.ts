import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';

import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { ConfirmMatchCommand } from '../commands/confirm-match.command';
import { RequestToPlayMatchUseCase } from '../use-cases/request-to-play.use-case';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from 'src/common/validators/match.validators';

@Injectable()
export class RequestToPlayMatchService implements RequestToPlayMatchUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchPlayersRepository: MatchPlayersRepository,
  ) {}

  async execute(command: ConfirmMatchCommand): Promise<void> {
    const match = await this.matchRepository.findById(command.matchId);

    validateExistence(match, 'Match', match.id);

    const matchPlayers = await this.matchPlayersRepository.findByMatchId(
      command.matchId,
    );

    validateMatch(match, matchPlayers, command.playerId);

    matchPlayers.addPendingRequest(command.playerId);
    await this.matchPlayersRepository.save(matchPlayers);
  }
}
