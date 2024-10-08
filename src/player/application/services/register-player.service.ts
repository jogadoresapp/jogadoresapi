import { Injectable } from '@nestjs/common';
import { RegisterPlayerUseCase } from '../usecases/register-player.use-case';
import { RegisterPlayerCommand } from '../commands/register-player.command';
import { Player } from '../../domain/entitites/player.entity';
import * as bcrypt from 'bcrypt';
import { PlayerRepository } from '../../infraestructure/repositories/player.repository';

@Injectable()
export class RegisterPlayerService implements RegisterPlayerUseCase {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async execute(command: RegisterPlayerCommand): Promise<string> {
    const hashedPassword = await bcrypt.hash(command.password, 10);

    const savedPlayer = await this.playerRepository.save(
      Player.create(command.name, command.email, hashedPassword),
    );

    return savedPlayer.id;
  }
}
