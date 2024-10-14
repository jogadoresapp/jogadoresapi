import { Injectable } from '@nestjs/common';
import { RegisterPlayerUseCase } from '../usecases/register-player.use-case';
import { RegisterPlayerCommand } from '../commands/register-player.command';
import { Player } from '../../domain/entities/player.entity';
import * as bcrypt from 'bcrypt';
import { PlayerRepository } from '../../infrastructure/repositories/player.repository';

@Injectable()
export class RegisterPlayerService implements RegisterPlayerUseCase {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(command: RegisterPlayerCommand): Promise<string> {
    const hashedPassword = await bcrypt.hash(command.password, 10);
    const player = Player.create(command.name, command.email, hashedPassword);
    const savedPlayer = await this.playerRepository.save(player);
    return savedPlayer.id;
  }
}
