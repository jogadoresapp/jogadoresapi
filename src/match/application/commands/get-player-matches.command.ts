import { ApiProperty } from '@nestjs/swagger';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';

export class GetPlayerMatchesCommand {
  @ApiProperty({
    description: 'Identificador da partida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public readonly playerId: string;

  @ApiProperty({
    description: 'Status da partida',
    example: STATUS_MATCH.A_REALIZAR,
  })
  public readonly status?: STATUS_MATCH;

  constructor(playerId: string, status?: STATUS_MATCH) {
    this.playerId = playerId;
    this.status = status;
  }
}
