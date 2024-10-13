import { ApiPropertyOptional } from '@nestjs/swagger';
import { SPORTS } from 'src/common/enums/sports.enum';
import { STATUS_MATCH } from 'src/common/enums/status-match.enum';
import { TEAM_LEVEL } from 'src/common/enums/team-level.enum';

export class GetAllMatchesCommand {
  @ApiPropertyOptional({
    description: 'Status da partida',
    example: STATUS_MATCH.A_REALIZAR,
  })
  status: STATUS_MATCH;

  @ApiPropertyOptional({
    description: 'Data da partida',
    example: '2021-10-10T00:00:00.000Z',
  })
  date: Date;

  @ApiPropertyOptional({
    description: 'Esporte da partida',
    example: SPORTS.FUTEBOL,
  })
  sport: SPORTS;

  @ApiPropertyOptional({
    description: 'Nível da partida',
    example: TEAM_LEVEL.INICIANTE,
  })
  teamLevel: TEAM_LEVEL;

  @ApiPropertyOptional({
    description: 'Cidade da partida',
    example: 'São Paulo',
  })
  city: string;

  @ApiPropertyOptional({
    description: 'Estado da partida',
    example: 'SP',
  })
  state: string;

  @ApiPropertyOptional({
    description: 'Id do jogador que criou a partida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  playerId: string;
}
