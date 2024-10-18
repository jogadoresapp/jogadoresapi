import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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

  constructor(player: Partial<Player>) {
    Object.assign(this, player);
  }

  static create(player: Player): Player {
    return new Player(player);
  }
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
