import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { PlayerModule } from './core/player/player.module';
import { MatchModule } from './core/match/match.module';

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
