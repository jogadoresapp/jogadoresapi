import { Player } from '../../domain/entities/player.entity';

export interface GetPlayerUseCase {
  execute(id: string): Promise<Player>;
}
