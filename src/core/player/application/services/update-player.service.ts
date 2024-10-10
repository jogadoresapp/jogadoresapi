import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePlayerUseCase } from '../usecases/update-player.use-case';
import { UpdatePlayerCommand } from '../commands/update-player.command';
import { Player } from '../../domain/entitites/player.entity';
import { PlayerRepository } from '../../infraestructure/repositories/player.repository';

@Injectable()
export class UpdatePlayerService implements UpdatePlayerUseCase {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(id: string, command: UpdatePlayerCommand): Promise<Player> {
    const player = await this.playerRepository.findById(id);

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    Object.assign(player, command);

    return this.playerRepository.update(id, player);
  }
}
