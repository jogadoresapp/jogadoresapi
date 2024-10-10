import { RegisterPlayerCommand } from '../commands/register-player.command';

export interface RegisterPlayerUseCase {
  execute(command: RegisterPlayerCommand): Promise<string>;
}
