import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';

import { ConfirmMatchUseCase } from '../use-cases/confirm-match.use-case';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { ConfirmMatchCommand } from '../commands/confirm-match.command';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';

@Injectable()
export class ConfirmMatchService implements ConfirmMatchUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchPlayersRepository: MatchPlayersRepository,
  ) {}

  async execute(command: ConfirmMatchCommand): Promise<void> {
    const match = await this.matchRepository.findById(command.matchId);
    if (!match) {
      throw new NotFoundException(`Match with ID ${command.matchId} not found`);
    }

    if (match.status !== STATUS_MATCH.A_REALIZAR) {
      throw new BadRequestException(
        'Can only confirm players for matches with status A_REALIZAR',
      );
    }

    if (match.availableSpots <= 0) {
      throw new BadRequestException('No available spots in this match');
    }

    const matchPlayers = await this.matchPlayersRepository.findByMatchId(
      command.matchId,
    );

    if (matchPlayers.isPlayerInMatch(command.playerId)) {
      throw new BadRequestException(
        'Player is already confirmed for this match',
      );
    }

    if (!matchPlayers.hasRequestedToPlay(command.playerId)) {
      throw new BadRequestException(
        'Player has not requested to play in this match',
      );
    }

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
