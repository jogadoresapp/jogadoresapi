import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class MatchPlayers {
  @PrimaryColumn()
  matchId: string;

  @Column('simple-array')
  players: string[];

  @Column('simple-array')
  pendingRequests: string[];

  constructor(matchId: string) {
    this.matchId = matchId;
    this.players = [];
    this.pendingRequests = [];
  }

  addPlayer(playerId: string) {
    if (!this.players.includes(playerId)) {
      this.players.push(playerId);
    }
  }

  removePlayer(playerId: string) {
    this.players = this.players.filter((id) => id !== playerId);
  }

  addPendingRequest(playerId: string) {
    if (!this.pendingRequests.includes(playerId)) {
      this.pendingRequests.push(playerId);
    }
  }

  removePendingRequest(playerId: string) {
    this.pendingRequests = this.pendingRequests.filter((id) => id !== playerId);
  }

  isPlayerInMatch(playerId: string): boolean {
    return this.players.includes(playerId);
  }

  hasRequestedToPlay(playerId: string): boolean {
    return this.pendingRequests.includes(playerId);
  }
}
