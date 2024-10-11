import { BadRequestException } from '@nestjs/common';
import { STATUS_MATCH } from '../enums/status-match.enum';
import { validateExistence } from '../helpers/validation.helper';

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
  playerId: string,
): void {
  if (matchPlayers.isPlayerInMatch(playerId)) {
    throw new BadRequestException(
      'O jogador já está confirmado para esta partida',
    );
  }
}

/**
 * Valida se o jogador já solicitou para jogar na partida
 * @param matchPlayers
 * @param playerId
 */
export function validatePendingRequest(
  matchPlayers: any,
  playerId: string,
): void {
  if (!matchPlayers.hasRequestedToPlay(playerId)) {
    throw new BadRequestException(
      'O jogador não solicitou para jogar nesta partida',
    );
  }
}

export function validateMatch(
  match: any,
  matchPlayers: any,
  playerId: string,
): void {
  validateExistence(match, 'Partida', match.id);
  validateMatchStatus(match);
  validateAvailableSpots(match);
  validatePlayerInMatch(matchPlayers, playerId);
  validatePendingRequest(matchPlayers, playerId);
}
