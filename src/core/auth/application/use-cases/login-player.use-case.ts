import { LoginPlayerCommand } from '../commands/login-player.command';

export interface LoginPlayerUseCase {
  execute(command: LoginPlayerCommand): Promise<{ accessToken: string }>;
}
