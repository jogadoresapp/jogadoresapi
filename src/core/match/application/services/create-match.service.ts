import { Injectable } from '@nestjs/common';
import { CreateMatchUseCase } from '../use-cases/create-match.use-case';
import { CreateMatchCommand } from '../commands/create-match.command';
import { Match } from '../../domain/entities/match.entity';
import { MatchRepository } from '../../infrastructure/repositories/match.repository';

@Injectable()
export class CreateMatchService implements CreateMatchUseCase {
  constructor(private readonly matchRepository: MatchRepository) {}

  async execute(command: CreateMatchCommand): Promise<string> {
    const savedMatch = await this.matchRepository.save(Match.newMatch(command));
    return savedMatch.id;
  }
}
