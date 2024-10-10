import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { ListPendingRequestsMatchesUseCase } from '../use-cases/list-pending-requests-matches.use-case';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

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
    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    const matchPlayers =
      await this.matchPlayersRepository.findByMatchId(matchId);

    return Array.from(matchPlayers.pendingRequests);
  }
}
