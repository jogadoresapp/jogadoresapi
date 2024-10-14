import { Player } from '../../domain/entities/player.entity';
import { UpdatePlayerCommand } from '../commands/update-player.command';

export interface UpdatePlayerUseCase {
  execute(id: string, command: UpdatePlayerCommand): Promise<Player>;
}
