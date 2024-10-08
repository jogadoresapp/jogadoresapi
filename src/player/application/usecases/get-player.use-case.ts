import { Player } from 'src/player/domain/entitites/player.entity';

export interface GetPlayerUseCase {
  execute(id: string): Promise<Player>;
}
