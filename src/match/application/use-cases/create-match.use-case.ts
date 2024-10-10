import { CreateMatchCommand } from '../commands/create-match.command';

export interface CreateMatchUseCase {
  execute(command: CreateMatchCommand): Promise<string>;
}
