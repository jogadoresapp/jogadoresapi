import { ConfirmMatchCommand } from '../commands/confirm-match.command';

export interface RequestToPlayMatchUseCase {
  execute(command: ConfirmMatchCommand): Promise<void>;
}
