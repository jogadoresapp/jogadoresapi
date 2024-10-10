import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';

import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { ConfirmMatchCommand } from '../commands/confirm-match.command';
import { RequestToPlayMatchUseCase } from '../use-cases/request-to-play.use-case';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';

@Injectable()
export class RequestToPlayMatchService implements RequestToPlayMatchUseCase {
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
        'Can only request to play matches with status A_REALIZAR',
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

    if (matchPlayers.hasRequestedToPlay(command.playerId)) {
      throw new BadRequestException(
        'Player has already requested to play in this match',
      );
    }

    matchPlayers.addPendingRequest(command.playerId);
    await this.matchPlayersRepository.save(matchPlayers);
  }
}
