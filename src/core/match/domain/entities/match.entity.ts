import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { STATUS_MATCH } from '../../../..//common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EditMatchCommand } from '../../application/commands/edit-match.command';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  private id: string;

  @Column()
  private dateGame: string;

  @Column()
  private playerId: string;

  @Column()
  private location: string;

  @Column({
    type: 'enum',
    enum: TEAM_LEVEL,
  })
  private teamLevel: TEAM_LEVEL;

  @Column()
  private availableSpots: number;

  @Column()
  private status: STATUS_MATCH;

  private constructor(
    id: string,
    dateGame: string,
    playerId: string,
    location: string,
    teamLevel: TEAM_LEVEL,
    availableSpots: number,
    status: STATUS_MATCH,
  ) {
    this.id = id;
    this.dateGame = dateGame;
    this.playerId = playerId;
    this.location = location;
    this.teamLevel = teamLevel;
    this.availableSpots = availableSpots;
    this.status = status;
  }

  static newMatch(command: CreateMatchCommand): Match {
    return new Match(
      undefined,
      command.dateGame,
      command.playerId,
      command.location,
      command.teamLevel,
      command.availableSpots,
      STATUS_MATCH.A_REALIZAR,
    );
  }

  updateMatch(command: EditMatchCommand): void {
    if (command.dateGame) this.setDateGame(command.dateGame);
    if (command.location) this.setLocation(command.location);
    if (command.availableSpots >= 0)
      this.setAvailableSpots(command.availableSpots);
  }

  getId(): string {
    return this.id;
  }

  getDateGame(): string {
    return this.dateGame;
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

  setId(id: string): void {
    this.id = id;
  }

  setDateGame(dateGame: string): void {
    this.dateGame = dateGame;
  }

  setLocation(location: string): void {
    this.location = location;
  }

  setAvailableSpots(availableSpots: number): void {
    this.availableSpots = availableSpots; // Manter lógica para evitar valores negativos, se necessário
  }

  setStatus(status: STATUS_MATCH): void {
    this.status = status;
  }
}
