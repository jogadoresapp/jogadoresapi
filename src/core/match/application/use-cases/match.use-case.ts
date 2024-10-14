import { MatchCommand } from '../commands/match.command';

export interface MatchUseCase {
  execute(command: MatchCommand): Promise<void>;
}
