import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt, Min, IsDateString } from 'class-validator';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

export class CreateMatchCommand {
  @ApiProperty({
    description: 'A data e hora da partida',
    example: '2024-10-15T18:00:00Z',
  })
  @IsDateString()
  public date: Date;

  @ApiProperty({
    description: 'O ID do jogador que está criando a partida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  public playerId: string;

  @ApiProperty({
    description: 'O local onde a partida ocorrerá',
    example: 'Estrela da Vila Baummer',
  })
  @IsString()
  public location: string;

  @ApiProperty({
    description: 'O nível de habilidade da equipe',
    enum: TEAM_LEVEL,
    example: TEAM_LEVEL.NORMAL,
  })
  @IsEnum(TEAM_LEVEL)
  public teamLevel: TEAM_LEVEL;

  @ApiProperty({
    description: 'O número de vagas disponíveis para a partida',
    example: 10,
  })
  @IsInt()
  @Min(1)
  public availableSpots: number;

  @ApiProperty({
    description: 'O esporte da partida',
    enum: SPORTS,
    example: SPORTS.FUTEBOL,
  })
  @IsEnum(SPORTS)
  public sport: SPORTS;

  @ApiProperty({
    description: 'O estado onde a partida ocorrerá',
    example: 'SP',
  })
  @IsString()
  public state: string;

  @ApiProperty({
    description: 'A cidade onde a partida ocorrerá',
    example: 'São Paulo',
  })
  @IsString()
  public city: string;
}
