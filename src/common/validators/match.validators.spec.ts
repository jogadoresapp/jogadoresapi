import { BadRequestException } from '@nestjs/common';
import {
  validateMatchStatus,
  validateAvailableSpots,
  validatePlayerInMatch,
  validateMatch,
} from './match.validators';
import { STATUS_MATCH } from '../enums/status-match.enum';

describe('Match Validators', () => {
  describe('validar status da partida para ações', () => {
    it('deve lançar BadRequestException se o status da partida não for A_REALIZAR', () => {
      const match = { status: STATUS_MATCH.EM_EXECUCAO };
      expect(() => validateMatchStatus(match)).toThrow(BadRequestException);
    });

    it('não deve lançar exceção se o status da partida for A_REALIZAR', () => {
      const match = { status: STATUS_MATCH.A_REALIZAR };
      expect(() => validateMatchStatus(match)).not.toThrow();
    });
  });

  describe('validar vagas disponíveis', () => {
    it('deve lançar BadRequestException se não houver vagas disponíveis', () => {
      const match = { availableSpots: 0 };
      expect(() => validateAvailableSpots(match)).toThrow(BadRequestException);
    });

    it('não deve lançar exceção se houver vagas disponíveis', () => {
      const match = { availableSpots: 1 };
      expect(() => validateAvailableSpots(match)).not.toThrow();
    });
  });

  describe('validatePlayerInMatch', () => {
    it('não deve lançar exceção se o jogador não estiver na partida', () => {
      const matchPlayers = [{ id: 1 }, { id: 2 }];
      const playerId = { id: 3 };
      expect(() =>
        validatePlayerInMatch(matchPlayers, playerId as any),
      ).not.toThrow();
    });
  });

  describe('deve validar o status da partida, vagas e se o jogador está dispoível', () => {
    it('deve validar o status da partida, as vagas disponíveis e a presença do jogador na partida', () => {
      const match = { status: STATUS_MATCH.A_REALIZAR, availableSpots: 1 };
      const matchPlayers = [{ id: 1 }, { id: 2 }];
      const playerId = { id: 3 };

      expect(() =>
        validateMatch(match, matchPlayers, playerId as any),
      ).not.toThrow();
    });

    it('deve lançar exceção se qualquer validação falhar', () => {
      const match = { status: 'OTHER_STATUS', availableSpots: 0 };
      const matchPlayers = [{ id: 1 }, { id: 2 }];
      const playerId = { id: 1 };

      expect(() => validateMatch(match, matchPlayers, playerId as any)).toThrow(
        BadRequestException,
      );
    });
  });
});
