import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { SPORTS } from '../../../../common/enums/sports.enum';

export class GetAllMatchesCommand {
  @ApiPropertyOptional({
    description: 'Status da partida',
    example: STATUS_MATCH.A_REALIZAR,
  })
  @IsOptional()
  status?: STATUS_MATCH;

  @ApiPropertyOptional({
    description: 'Esporte da partida',
    example: SPORTS.FUTEBOL,
  })
  @IsOptional()
  sport?: SPORTS;

  @ApiPropertyOptional({
    description: 'Nível da partida',
    example: TEAM_LEVEL.INICIANTE,
  })
  @IsOptional()
  teamLevel?: TEAM_LEVEL;

  @ApiPropertyOptional({
    description: 'Cidade da partida',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Estado da partida',
    example: 'SP',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Id do jogador que criou a partida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  playerId?: string;
}
