import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './domain/entities/match.entity';
import { MatchController } from './infrastructure/http/match.controller';
import { CreateMatchService } from './application/services/create-match.service';
import { MatchRepository } from './infrastructure/repositories/match.repository';
import { MatchPlayers } from './domain/entities/match-player.entity';
import { MatchPlayersRepository } from './infrastructure/repositories/match-players.repository';
import { GetAllMatchesService } from './application/services/get-all-matches.service';
import { GetPlayerMatchesService } from './application/services/get-player-matches.use-case';
import { RequestToPlayMatchService } from './application/services/request-to-play.service';
import { ConfirmMatchService } from './application/services/confirm-match.service';
import { CancelMatchService } from './application/services/cancel-match.service';
import { EditMatchService } from './application/services/edit-match.service';
import { ListPendingRequestsMatchesService } from './application/services/list-pending-requests-matches.service';
import { GetPlayersMatchesService } from './application/services/get-players-matches.service';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchPlayers]), PlayerModule],
  controllers: [MatchController],
  providers: [
    CreateMatchService,
    GetAllMatchesService,
    GetPlayerMatchesService,
    RequestToPlayMatchService,
    ConfirmMatchService,
    CancelMatchService,
    EditMatchService,
    ListPendingRequestsMatchesService,
    GetPlayersMatchesService,
    MatchRepository,
    MatchPlayersRepository,
  ],
  exports: [CreateMatchService],
})
export class MatchModule {}
