import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPlayerUseCase } from '../usecases/get-player.use-case';
import { PlayerRepository } from '../../infrastructure/repositories/player.repository';
import { GetPlayerCommand } from '../commands/get-player.command';

@Injectable()
export class GetPlayerService implements GetPlayerUseCase {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(id: string): Promise<GetPlayerCommand> {
    const player = await this.playerRepository.findById(id);
    if (!player)
      throw new NotFoundException(`Jogador com ID ${id} não encontrado`);
    return player;
  }
}
