import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './domain/entities/match.entity';
import { MatchController } from './infrastructure/http/match.controller';
import { CreateMatchService } from './services/create-match.service';
import { MatchRepository } from './infrastructure/repositories/match.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchController],
  providers: [CreateMatchService, MatchRepository],
  exports: [CreateMatchService],
})
export class MatchModule {}
