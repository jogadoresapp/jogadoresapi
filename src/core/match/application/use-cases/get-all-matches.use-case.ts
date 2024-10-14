import { Match } from '../../domain/entities/match.entity';
import { GetAllMatchesCommand } from '../commands/get-all-matches.command';

export interface GetAllMatchesUseCase {
  execute(query: GetAllMatchesCommand): Promise<Match[]>;
}
