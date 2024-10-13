import { ApiProperty } from '@nestjs/swagger';
import { Player } from 'src/core/player/domain/entitites/player.entity';

export class MatchCommand {
  @ApiProperty({
    description: 'Identificador da partida',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public readonly matchId: string;

  @ApiProperty({
    description: 'identificador do jogador',
    example: '98765432-e89b-12d3-a456-426614174000',
  })
  public readonly playerId: Pick<Player, 'id'>;

  constructor(matchId: string, playerId: Pick<Player, 'id'>) {
    this.matchId = matchId;
    this.playerId = playerId;
  }
}
