import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class MatchPlayers {
  @PrimaryGeneratedColumn('uuid')
  private id: string;

  @Column({ type: 'uuid', name: 'match_id' })
  private matchId: string;

  @Column({ type: 'uuid', name: 'player_id' })
  private playerId: string;

  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  private deletedAt: Date;

  constructor(matchId: string, playerId: string) {
    this.matchId = matchId;
    this.playerId = playerId;
  }

  static create(matchId: string, playerId: string): MatchPlayers {
    return new MatchPlayers(matchId, playerId);
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
