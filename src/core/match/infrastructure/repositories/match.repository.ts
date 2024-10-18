import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from '../../domain/entities/match.entity';
import { GetAllMatchesCommand } from '../../application/commands/get-all-matches.command';
import { Player } from '../../../player/domain/entities/player.entity';

@Injectable()
export class MatchRepository {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>,
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
  ) {}

  async save(match: Partial<Match>): Promise<Match> {
    const createdMatch = await this.matchModel.create(match);
    return createdMatch.save();
  }

  async findById(id: string): Promise<Match | null> {
    return this.matchModel.findById(id).exec();
  }

  async update(id: string, match: Partial<Match>): Promise<Match | null> {
    return this.matchModel.findByIdAndUpdate(id, match, { new: true }).exec();
  }

  async findAllByFilters(filters: GetAllMatchesCommand): Promise<Match[]> {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.sport) {
      query.sport = filters.sport;
    }

    if (filters.teamLevel) {
      query.teamLevel = filters.teamLevel;
    }

    if (filters.city) {
      query.city = filters.city;
    }

    if (filters.state) {
      query.state = filters.state;
    }

    if (filters.playerId) {
      query.playerId = filters.playerId;
    }

    // if (filters.date) {
    //   query.date = filters.date;
    // }

    return this.matchModel.find(query).exec();
  }

  async getPlayersFromMatch(matchId: string): Promise<Player[]> {
    const match = await this.matchModel.findById(matchId).exec();
    if (!match) return [];
    return this.playerModel.find({ _id: { $in: match.players } }).exec();
  }

  async getMatchesFromPlayer(playerId: string): Promise<Match[]> {
    return this.matchModel.find({ players: playerId }).exec();
  }

  async addPlayerToMatch(
    matchId: string,
    playerId: string,
  ): Promise<Match | null> {
    return this.matchModel
      .findByIdAndUpdate(
        matchId,
        { $addToSet: { players: playerId } },
        { new: true },
      )
      .exec();
  }

  async removePlayerFromMatch(
    matchId: string,
    playerId: string,
  ): Promise<Match | null> {
    return this.matchModel
      .findByIdAndUpdate(
        matchId,
        { $pull: { players: playerId } },
        { new: true },
      )
      .exec();
  }
}
