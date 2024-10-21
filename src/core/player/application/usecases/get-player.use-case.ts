import { GetPlayerCommand } from '../commands/get-player.command';

export interface GetPlayerUseCase {
  execute(id: string): Promise<GetPlayerCommand>;
}
