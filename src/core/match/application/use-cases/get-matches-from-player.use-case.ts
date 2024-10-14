import { Match } from '../../domain/entities/match.entity';

export interface GetMatchesFromPlayer {
  execute(playerId: string): Promise<Match[]>;
}
