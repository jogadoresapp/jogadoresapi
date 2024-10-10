import { ApiProperty } from '@nestjs/swagger';

export class ConfirmMatchCommand {
  @ApiProperty({
    description: 'Identificador da partida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public readonly matchId: string;

  @ApiProperty({
    description: 'identificador do jogador',
    example: '98765432-e89b-12d3-a456-426614174000',
  })
  public readonly playerId: string;

  constructor(matchId: string, playerId: string) {
    this.matchId = matchId;
    this.playerId = playerId;
  }
}
