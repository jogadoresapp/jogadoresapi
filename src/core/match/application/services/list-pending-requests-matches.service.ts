import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { ListPendingRequestsMatchesUseCase } from '../use-cases/list-pending-requests-matches.use-case';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { Injectable } from '@nestjs/common';
import { validateExistence } from '../../../../common/helpers/validation.helper';

@Injectable()
export class ListPendingRequestsMatchesService
  implements ListPendingRequestsMatchesUseCase
{
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchPlayersRepository: MatchPlayersRepository,
  ) {}

  async execute(matchId: string): Promise<string[]> {
    const match = await this.matchRepository.findById(matchId);
    validateExistence(match, 'Partida', matchId);

    const matchPlayers =
      await this.matchPlayersRepository.findByMatchId(matchId);

    return Array.from(matchPlayers.pendingRequests);
  }
}
