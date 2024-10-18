import { Module } from '@nestjs/common';
import { Match, MatchSchema } from './domain/entities/match.entity';
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
import { GetMatchesFromPlayerService } from './application/services/get-matches-from-player.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from '../player/domain/entities/player.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
    PlayerModule,
  ],
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
    GetMatchesFromPlayerService,
    MatchRepository,
  ],
  exports: [CreateMatchService],
})
export class MatchModule {}
