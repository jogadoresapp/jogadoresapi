import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginPlayerCommand } from '../../application/commands/login-player.command';
import { LoginPlayerService } from '../../application/services/login-player.service';

ApiTags('auth');
@Controller('auth')
export class AuthController {
  constructor(private readonly service: LoginPlayerService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de um jogador' })
  @ApiResponse({ status: 200, description: 'Retorna o token de acesso JWT' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async login(@Body() command: LoginPlayerCommand) {
    return this.service.execute(command);
  }
}
