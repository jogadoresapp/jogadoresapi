import { Player } from '../../../player/domain/entitites/player.entity';

export interface GetPlayersFromMatchUseCase {
  execute(matchId: string): Promise<Player[]>;
}
