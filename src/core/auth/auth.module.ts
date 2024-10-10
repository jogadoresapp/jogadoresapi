import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PlayerModule } from '../player/player.module';
import { AuthController } from './infrastructure/http/auth.controller';
import { AuthService } from './application/services/auth.service';
import { LoginPlayerService } from './application/services/login-player.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PlayerModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LoginPlayerService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
