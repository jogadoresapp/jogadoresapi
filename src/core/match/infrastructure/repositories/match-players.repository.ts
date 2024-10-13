import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchPlayers } from '../../domain/entities/match-player.entity';

@Injectable()
export class MatchPlayersRepository {
  constructor(
    @InjectRepository(MatchPlayers)
    private readonly repository: Repository<MatchPlayers>,
  ) {}

  async save(matchPlayers: MatchPlayers): Promise<MatchPlayers> {
    return this.repository.save(matchPlayers);
  }

  async findById(matchId: string): Promise<MatchPlayers | null> {
    return this.repository.findOne({ where: { matchId } as any });
  }

  async findByPlayerId(playerId: string): Promise<MatchPlayers | null> {
    return this.repository.findOne({ where: { playerId } as any });
  }
}
