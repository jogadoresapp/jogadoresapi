import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPlayerUseCase } from '../usecases/get-player.use-case';
import { Player } from '../../domain/entitites/player.entity';
import { PlayerRepository } from '../../infraestructure/repositories/player.repository';

@Injectable()
export class GetPlayerService implements GetPlayerUseCase {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(id: string): Promise<Player> {
    const player = await this.playerRepository.findById(id);
    if (!player)
      throw new NotFoundException(`Jogador com ID ${id} não encontrado`);
    return player;
  }
}
