import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlayerRepository } from '../../../player/infraestructure/repositories/player.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../domain/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const player = await this.playerRepository.findByEmail(email);
    if (!player) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: player.email, sub: player.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
