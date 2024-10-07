import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseConfig,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
