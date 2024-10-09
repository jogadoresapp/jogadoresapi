import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt, Min } from 'class-validator';
import { TEAM_LEVEL } from '../../../common/enums/team-level.enum';
import { Transform } from 'class-transformer';

export class CreateMatchCommand {
  @ApiProperty({
    description: 'The date and time of the match',
    example: '2024-10-15T18:00:00Z',
  })
  @Transform(({ value }) => new Date(value))
  public readonly date: Date;

  @ApiProperty({
    description: 'The ID of the player creating the match',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  public readonly playerId: string;

  @ApiProperty({
    description: 'The location where the match will take place',
    example: 'Central Park Football Field',
  })
  @IsString()
  public readonly location: string;

  @ApiProperty({
    description: 'The skill level of the team',
    enum: TEAM_LEVEL,
    example: TEAM_LEVEL.NORMAL,
  })
  @IsEnum(TEAM_LEVEL)
  public readonly teamLevel: TEAM_LEVEL;

  @ApiProperty({
    description: 'The number of spots available for the match',
    minimum: 2,
    example: 10,
  })
  @IsInt()
  @Min(2)
  public readonly availableSpots: number;

  constructor(
    date: Date,
    playerId: string,
    location: string,
    teamLevel: TEAM_LEVEL,
    availableSpots: number,
  ) {
    this.date = date;
    this.playerId = playerId;
    this.location = location;
    this.teamLevel = teamLevel;
    this.availableSpots = availableSpots;
  }
}
