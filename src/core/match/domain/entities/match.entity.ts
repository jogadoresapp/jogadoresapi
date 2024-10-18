import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { HydratedDocument } from 'mongoose';

export type MatchDocument = HydratedDocument<Match>;

@Schema({ timestamps: true })
export class Match {
  @Prop({
    type: String,
    default: uuidv4,
    unique: true,
  })
  id: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: String })
  playerId: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, enum: TEAM_LEVEL })
  teamLevel: TEAM_LEVEL;

  @Prop({ required: true })
  availableSpots: number;

  @Prop({
    required: true,
    enum: STATUS_MATCH,
    default: STATUS_MATCH.A_REALIZAR,
  })
  status: STATUS_MATCH;

  @Prop({ required: true, enum: SPORTS, default: SPORTS.FUTEBOL })
  sport: SPORTS;

  @Prop({ type: [{ type: String }], default: [] })
  players: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  constructor(partial: Partial<Match>) {
    Object.assign(this, partial);
  }

  public static newMatch(command: CreateMatchCommand): Match {
    return new Match({
      date: command.date,
      playerId: command.playerId,
      location: command.location,
      teamLevel: command.teamLevel,
      availableSpots: command.availableSpots,
      sport: SPORTS.FUTEBOL,
      status: STATUS_MATCH.A_REALIZAR,
      city: command.city,
      state: command.state,
      players: [],
    });
  }

  updateMatch(command: EditMatchCommand): void {
    if (command.dateGame) this.date = command.dateGame;
    if (command.location) this.location = command.location;
    if (command.availableSpots >= 0)
      this.availableSpots = command.availableSpots;
  }

  cancelMatch(): void {
    this.status = STATUS_MATCH.CANCELADA;
  }

  plusOneSpot(): void {
    this.availableSpots++;
  }

  minusOneSpot(): void {
    this.availableSpots--;
  }

  addPlayer(playerId: string): void {
    if (!this.players.includes(playerId)) {
      this.players.push(playerId);
      this.minusOneSpot();
    }
  }

  removePlayer(playerId: string): void {
    const index = this.players.indexOf(playerId);
    if (index > -1) {
      this.players.splice(index, 1);
      this.plusOneSpot();
    }
  }
}

export const MatchSchema = SchemaFactory.createForClass(Match);
