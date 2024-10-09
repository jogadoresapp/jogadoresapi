import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/application/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseConfig,
    PlayerModule,
    AuthModule,
    MatchModule,
  ],
})
export class AppModule {}
