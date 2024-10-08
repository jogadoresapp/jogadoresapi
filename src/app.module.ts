import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseConfig,
    PlayerModule,
    AuthModule,
  ],
})
export class AppModule {}
