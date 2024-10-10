import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../../domain/entitites/player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectRepository(Player)
    private readonly repository: Repository<Player>,
  ) {}

  async save(player: Player): Promise<Player> {
    return this.repository.save(player);
  }

  async findById(id: string): Promise<Player | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAllByIds(ids: string[]): Promise<Player[]> {
    return this.repository.findByIds(ids);
  }

  async findByEmail(email: string): Promise<Player | null> {
    return this.repository.findOne({ where: { email } });
  }

  async update(id: string, player: Partial<Player>): Promise<Player> {
    await this.repository.update(id, player);
    return this.findById(id);
  }
}
