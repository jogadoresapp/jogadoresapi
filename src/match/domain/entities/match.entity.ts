import { CreateMatchCommand } from '../../application/commands/create-match.command';
import { STATUS_MATCH } from '../../..//common/enums/status-match.enum';
import { TEAM_LEVEL } from '../../../common/enums/team-level.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dateGame: string;

  @Column()
  playerId: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: TEAM_LEVEL,
  })
  teamLevel: TEAM_LEVEL;

  @Column()
  availableSpots: number;

  @Column()
  status: STATUS_MATCH;

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
}
