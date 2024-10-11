import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { Injectable } from '@nestjs/common';
import { Match } from '../../domain/entities/match.entity';
import { GetPlayerMatchesUseCase } from '../use-cases/get-player-matches.use-case';
import { GetPlayerMatchesCommand } from '../commands/get-player-matches.command';
import { MatchPlayersRepository } from '../../infrastructure/repositories/match-players.repository';

@Injectable()
export class GetMatchesByPlayerService implements GetPlayerMatchesUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchPlayersRepository: MatchPlayersRepository,
  ) {}

  async execute(query: GetPlayerMatchesCommand): Promise<Match[]> {
    const matchIds = await this.matchPlayersRepository.findByPlayerId(
      query.playerId,
    );

    let matches = await this.matchRepository.findAllById(matchIds);

    if (query.status) {
      matches = matches.filter((match) => match.getStatus() === query.status);
    }

    return matches;
  }
}
