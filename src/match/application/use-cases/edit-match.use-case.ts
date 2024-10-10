import { EditMatchCommand } from '../commands/edit-match.command';

export interface EditMatchUseCase {
  execute(id: string, command: EditMatchCommand): Promise<void>;
}
