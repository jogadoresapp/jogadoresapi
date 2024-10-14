import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './domain/entities/player.entity';
import { Module } from '@nestjs/common';
import { PlayerController } from './infrastructure/http/player.controller';
import { RegisterPlayerService } from './application/services/register-player.service';
import { GetPlayerService } from './application/services/get-player.service';
import { UpdatePlayerService } from './application/services/update-player.service';
import { PlayerRepository } from './infrastructure/repositories/player.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  controllers: [PlayerController],
  providers: [
    RegisterPlayerService,
    GetPlayerService,
    UpdatePlayerService,

    PlayerRepository,
  ],
  exports: [PlayerRepository],
})
export class PlayerModule {}
