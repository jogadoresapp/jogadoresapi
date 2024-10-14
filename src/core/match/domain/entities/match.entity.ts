import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { STATUS_MATCH } from '../../../..//common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { SPORTS } from '../../../../common/enums/sports.enum';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  private id: string;

  @Column({ type: 'timestamptz', nullable: false })
  private date: Date;

  @Column({ type: 'uuid', nullable: false, name: 'player_id' })
  private playerId: string;

  @Column({ type: 'varchar', nullable: false })
  private location: string;

  @Column({ type: 'varchar', nullable: false })
  private city: string;

  @Column({ type: 'varchar', nullable: false })
  private state: string;

  @Column({
    type: 'enum',
    enum: TEAM_LEVEL,
    name: 'team_level',
  })
  private teamLevel: TEAM_LEVEL;

  @Column({ type: 'int', nullable: false, name: 'available_spots' })
  private availableSpots: number;

  @Column({ type: 'enum', enum: STATUS_MATCH, nullable: false, name: 'status' })
  private status: STATUS_MATCH;

  @Column({ type: 'enum', enum: SPORTS, nullable: false })
  private sport: SPORTS;

  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  private deletedAt: Date;

  private constructor(
    id: string,
    date: Date,
    playerId: string,
    location: string,
    teamLevel: TEAM_LEVEL,
    availableSpots: number,
    sport: SPORTS,
    status: STATUS_MATCH,
    city: string,
    state: string,
  ) {
    this.id = id;
    this.date = date;
    this.playerId = playerId;
    this.location = location;
    this.teamLevel = teamLevel;
    this.availableSpots = availableSpots;
    this.sport = sport;
    this.status = status;
    this.city = city;
    this.state = state;
  }

  static newMatch(command: CreateMatchCommand): Match {
    return new Match(
      undefined,
      command.date,
      command.playerId,
      command.location,
      command.teamLevel,
      command.availableSpots,
      SPORTS.FUTEBOL,
      STATUS_MATCH.A_REALIZAR,
      command.city,
      command.state,
    );
  }

  updateMatch(command: EditMatchCommand): void {
    if (command.dateGame) this.setDateGame(command.dateGame);
    if (command.location) this.setLocation(command.location);
    if (command.availableSpots >= 0)
      this.setAvailableSpots(command.availableSpots);
  }

  cancelMatch(): void {
    this.setStatus(STATUS_MATCH.CANCELADA);
  }

  plusOneSpot(): void {
    this.availableSpots++;
  }

  minusOneSpot(): void {
    this.availableSpots--;
  }

  getId(): string {
    return this.id;
  }

  getDateGame(): Date {
    return this.date;
  }

  getPlayerId(): string {
    return this.playerId;
  }

  getLocation(): string {
    return this.location;
  }

  getTeamLevel(): TEAM_LEVEL {
    return this.teamLevel;
  }

  getAvailableSpots(): number {
    return this.availableSpots;
  }

  getStatus(): STATUS_MATCH {
    return this.status;
  }

  getSports(): SPORTS {
    return this.sport;
  }

  getCity(): string {
    return this.city;
  }

  getState(): string {
    return this.state;
  }

  setId(id: string): void {
    this.id = id;
  }

  setDateGame(dateGame: Date): void {
    this.date = dateGame;
  }

  setLocation(location: string): void {
    this.location = location;
  }

  setAvailableSpots(availableSpots: number): void {
    this.availableSpots = availableSpots;
  }

  setStatus(status: STATUS_MATCH): void {
    this.status = status;
  }

  setSport(sport: SPORTS): void {
    this.sport = sport;
  }
}
