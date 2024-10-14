import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './domain/entities/match.entity';
import { MatchController } from './infrastructure/http/match.controller';
import { CreateMatchService } from './application/services/create-match.service';
import { MatchRepository } from './infrastructure/repositories/match.repository';
import { GetAllMatchesService } from './application/services/get-all-matches.service';
import { JoinMatchService } from './application/services/join-match.service';
import { CancelMatchService } from './application/services/cancel-match.service';
import { EditMatchService } from './application/services/edit-match.service';
import { PlayerModule } from '../player/player.module';
import { GetMatchByIdService } from './application/services/get-match-by-id.service';
import { GetPlayersFromMatchService } from './application/services/get-players-from-match.service';
import { LeaveMatchService } from './application/services/leave-match.service';
import { MatchPlayersRepository } from './infrastructure/repositories/match-players.repository';
import { MatchPlayers } from './domain/entities/match-player.entity';
import { GetMatchesFromPlayerhService } from './application/services/get-matches-from-player.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchPlayers]), PlayerModule],
  controllers: [MatchController],
  providers: [
    CreateMatchService,
    GetAllMatchesService,
    GetMatchByIdService,
    JoinMatchService,
    LeaveMatchService,
    CancelMatchService,
    EditMatchService,
    GetPlayersFromMatchService,
    GetMatchesFromPlayerhService,
    MatchRepository,
    MatchPlayersRepository,
  ],
  exports: [CreateMatchService],
})
export class MatchModule {}
