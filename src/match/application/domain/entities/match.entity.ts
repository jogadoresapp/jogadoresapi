import { TEAM_LEVEL } from '../../../../common/enums/team-level.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: Date;

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
  status: 'A_REALIZAR' | 'EM_EXECUCAO' | 'REALIZADA' | 'CANCELADA';
}
