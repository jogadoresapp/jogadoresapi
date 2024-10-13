import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class MatchPlayers {
  @PrimaryColumn()
  private matchId: string;

  @Column()
  private playerId: string;

  constructor(matchId: string) {
    this.matchId = matchId;
  }

  static create(matchId: string): MatchPlayers {
    return new MatchPlayers(matchId);
  }

  getMatchId(): string {
    return this.matchId;
  }

  getPlayerId(): string {
    return this.playerId;
  }

  setMatchId(matchId: string) {
    this.matchId = matchId;
  }

  setPlayerId(playerId: string) {
    this.playerId = playerId;
  }
}
