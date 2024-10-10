import { Match } from '../../domain/entities/match.entity';
import { GetPlayerMatchesCommand } from '../commands/get-player-matches.command';

export interface GetPlayerMatchesUseCase {
  execute(query: GetPlayerMatchesCommand): Promise<Match[]>;
}
