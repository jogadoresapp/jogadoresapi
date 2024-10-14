import { Player } from '../../../player/domain/entities/player.entity';

export interface GetPlayersFromMatchUseCase {
  execute(matchId: string): Promise<Player[]>;
}
