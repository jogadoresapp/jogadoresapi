import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';

import { ConfirmMatchUseCase } from '../use-cases/confirm-match.use-case';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { ConfirmMatchCommand } from '../commands/confirm-match.command';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from 'src/common/validators/match.validators';

@Injectable()
export class ConfirmMatchService implements ConfirmMatchUseCase {
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

    matchPlayers.addPlayer(command.playerId);
    matchPlayers.removePendingRequest(command.playerId);

    await this.matchPlayersRepository.save(matchPlayers);

    match.availableSpots--;

    if (match.availableSpots === 0) {
      match.status = STATUS_MATCH.CONFIRMADA;
    }
    await this.matchRepository.update(match.id, match);
  }
}
