import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { RegisterPlayerService } from '../../application/services/register-player.service';
import { GetPlayerService } from '../../application/services/get-player.service';
import { UpdatePlayerService } from '../../application/services/update-player.service';
import { RegisterPlayerCommand } from '../../application/commands/register-player.command';
import { Player } from '../../domain/entitites/player.entity';
import { UpdatePlayerCommand } from '../../application/commands/update-player.command';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Jogadores')
@Controller('jogadores')
export class PlayerController {
  constructor(
    private readonly registerPlayerService: RegisterPlayerService,
    private readonly getPlayerService: GetPlayerService,
    private readonly updatePlayerService: UpdatePlayerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo jogador' })
  @ApiBody({ type: RegisterPlayerCommand })
  @ApiResponse({
    status: 201,
    description: 'Jogador criado com sucesso.',
    type: String,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 409,
    description: 'Já existe  um jogador com o email informado.',
  })
  async registerPlayer(
    @Body() command: RegisterPlayerCommand,
  ): Promise<{ id: string }> {
    const playerId = await this.registerPlayerService.execute(command);
    return { id: playerId };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pegar jogador pelo id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Player ID' })
  @ApiResponse({
    status: 200,
    description: 'Dados do jogador.',
    type: Player,
  })
  @ApiResponse({ status: 404, description: 'Jogador não encontrado.' })
  async getPlayer(@Param('id') id: string): Promise<Player> {
    return this.getPlayerService.execute(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Atualizar jogador' })
  @ApiParam({ name: 'id', type: 'string', description: 'Jogador ID' })
  @ApiBody({ type: UpdatePlayerCommand })
  @ApiResponse({
    status: 200,
    description: 'Jogador atualizado com sucesso',
    type: Player,
  })
  @ApiResponse({ status: 404, description: 'Jogador não encontrado.' })
  async updatePlayer(
    @Param('id') id: string,
    @Body() command: UpdatePlayerCommand,
  ): Promise<Player> {
    return this.updatePlayerService.execute(id, command);
  }
}
