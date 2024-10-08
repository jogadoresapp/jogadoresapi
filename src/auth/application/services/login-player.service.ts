import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPlayerCommand } from '../commands/login-player.command';
import { LoginPlayerUseCase } from '../use-cases/login-player.use-case';

@Injectable()
export class LoginPlayerService implements LoginPlayerUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginPlayerCommand): Promise<{ accessToken: string }> {
    return this.authService.login(command.email, command.password);
  }
}
