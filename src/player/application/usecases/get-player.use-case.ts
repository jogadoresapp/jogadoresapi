import { Player } from '../../../player/domain/entitites/player.entity';

export interface GetPlayerUseCase {
  execute(id: string): Promise<Player>;
}
