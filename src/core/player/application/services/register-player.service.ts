import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterPlayerUseCase } from '../usecases/register-player.use-case';
import { RegisterPlayerCommand } from '../commands/register-player.command';
import { Player } from '../../domain/entities/player.entity';
import * as bcrypt from 'bcryptjs';
import { PlayerRepository } from '../../infrastructure/repositories/player.repository';

@Injectable()
export class RegisterPlayerService implements RegisterPlayerUseCase {
  constructor(private readonly repository: PlayerRepository) {}

  async execute(command: RegisterPlayerCommand): Promise<string> {
    if (this.repository.findByEmail(command.email)) {
      throw new BadRequestException('Email já cadastrado');
    }
    const hashedPassword = await bcrypt.hash(command.password, 10);
    const player = Player.create(
      new Player({
        name: command.name,
        nickname: command.nickname,
        email: command.email,
        password: hashedPassword,
        position: command.position,
        dominantFoot: command.dominantFoot,
        city: command.city,
        state: command.state,
        preferredSchedule: command.preferredSchedule,
        preferredDays: command.preferredDays,
      }),
    );
    const savedPlayer = await this.repository.save(player);
    return savedPlayer.id;
  }
}
