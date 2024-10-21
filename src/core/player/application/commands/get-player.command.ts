import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  PlayerDominantFoot,
  PlayerPosition,
  PlayerPreferredDays,
  PlayerPreferredSchedule,
} from '../../domain/enums/player';

export class GetPlayerCommand {
  @ApiPropertyOptional()
  id: string;

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  nickname: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  position: PlayerPosition[];

  @ApiPropertyOptional()
  dominantFoot: PlayerDominantFoot;

  @ApiPropertyOptional()
  preferredSchedule: PlayerPreferredSchedule[];

  @ApiPropertyOptional()
  preferredDays: PlayerPreferredDays[];

  @ApiPropertyOptional()
  city: string;

  @ApiPropertyOptional()
  state: string;
}
