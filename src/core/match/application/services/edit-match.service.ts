import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';
import { EditMatchUseCase } from '../use-cases/edit-match.use-case';
import { EditMatchCommand } from '../commands/edit-match.command';

@Injectable()
export class EditMatchService implements EditMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(id: string, command: EditMatchCommand): Promise<void> {
    const match = await this.matchRepository.findById(id);
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    Object.assign(match, {
      dateGame: command.dateGame ?? match.dateGame,
      location: command.location ?? match.location,
      availableSpots: command.availableSpots ?? match.availableSpots,
    });

    await this.matchRepository.update(id, match);
  }
}
