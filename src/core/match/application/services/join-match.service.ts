import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { MatchUseCase } from '../use-cases/match.use-case';
import { MatchCommand } from '../commands/match.command';
import { validateExistence } from '../../../../common/helpers/validation.helper';
import { validateMatch } from '../../../../common/validators/match.validators';

@Injectable()
export class JoinMatchService implements MatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(command: MatchCommand): Promise<void> {
    const match = await this.matchRepository.findById(command.matchId);
    validateExistence(match, 'Partida', command.matchId);
    validateMatch(match, match, command.playerId);

    if (match.availableSpots === 0) {
      throw new BadRequestException('Partida já está cheia');
    }

    if (match.players.includes(command.playerId)) {
      throw new BadRequestException('Jogador já está na partida');
    }

    const updatedMatch = await this.matchRepository.addPlayerToMatch(
      command.matchId,
      command.playerId,
    );

    if (updatedMatch) {
      updatedMatch.minusOneSpot();
      await this.matchRepository.update(updatedMatch.id, updatedMatch);
    } else {
      throw new BadRequestException('Falha ao adicionar jogador à partida');
    }
  }
}
