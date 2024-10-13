import { BadRequestException } from '@nestjs/common';
import { STATUS_MATCH } from '../enums/status-match.enum';
import { Player } from 'src/core/player/domain/entitites/player.entity';

/**
 * Valida se a partida está com o status A_REALIZAR
 * @param match
 * @throws BadRequestException
 * @returns void
 */
export function validateMatchStatus(match: any): void {
  if (match.status !== STATUS_MATCH.A_REALIZAR) {
    throw new BadRequestException(
      'Apenas é possível realizar operações em partidas com o status A_REALIZAR',
    );
  }
}

/**
 * Valida se há vagas disponíveis na partida
 * @param match
 * @throws BadRequestException
 */
export function validateAvailableSpots(match: any): void {
  if (match.availableSpots <= 0) {
    throw new BadRequestException('Não há vagas disponíveis nesta partida');
  }
}

/**
 * Valida se o jogador já está confirmado para a partida
 * @param matchPlayers
 * @param playerId
 * @throws BadRequestException
 */
export function validatePlayerInMatch(
  matchPlayers: any,
  playerId: Pick<Player, 'id'>,
): void {
  console.log(matchPlayers, playerId);
}

/**
 * Valida se a partida está com o status A_REALIZAR, se há vagas disponíveis e se o jogador já está confirmado
 * @param match
 * @param matchPlayers
 * @param playerId
 * @throws BadRequestException
 */
export function validateMatch(
  match: any,
  matchPlayers: any,
  playerId: Pick<Player, 'id'>,
): void {
  validateMatchStatus(match);
  validateAvailableSpots(match);
  validatePlayerInMatch(matchPlayers, playerId);
}
