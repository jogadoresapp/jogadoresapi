import { ConfirmMatchCommand } from '../commands/confirm-match.command';

export interface ConfirmMatchUseCase {
  execute(command: ConfirmMatchCommand): Promise<void>;
}
