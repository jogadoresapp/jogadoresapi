import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from '../../domain/entities/player.entity';
import { GetPlayerCommand } from '../../application/commands/get-player.command';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async save(playerData: Partial<Player>): Promise<Player> {
    const createdPlayer = await this.playerModel.create(playerData);
    return createdPlayer.toObject();
  }

  async findById(id: string): Promise<GetPlayerCommand> {
    return this.playerModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<Player> {
    return this.playerModel.findOne({ email }).exec();
  }

  async update(id: string, player: Partial<Player>): Promise<Player | null> {
    return this.playerModel.findByIdAndUpdate(id, player, { new: true }).exec();
  }
}
