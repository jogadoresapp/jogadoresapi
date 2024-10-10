import { Player } from '../../../player/domain/entitites/player.entity';

export interface GetMatchPlayesUseCase {
  execute(matchId: string): Promise<Player[]>;
}
