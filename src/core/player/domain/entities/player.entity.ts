import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  PlayerDominantFoot,
  PlayerPosition,
  PlayerPreferredDays,
  PlayerPreferredSchedule,
} from '../enums/player';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
  @Prop({
    type: String,
    default: uuidv4,
    unique: true,
  })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  position: PlayerPosition[];

  @Prop({ required: true })
  dominantFoot: PlayerDominantFoot;

  @Prop({ default: [] })
  preferredSchedule: PlayerPreferredSchedule[];

  @Prop({ required: true })
  preferredDays: PlayerPreferredDays[];

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ default: 10, required: false })
  rating: number;

  constructor(player: Partial<Player>) {
    Object.assign(this, player);
  }

  static create(player: Player): Player {
    return new Player(player);
  }
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
