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

@ApiTags('players')
@Controller('player')
export class PlayerController {
  constructor(
    private readonly registerPlayerService: RegisterPlayerService,
    private readonly getPlayerService: GetPlayerService,
    private readonly updatePlayerService: UpdatePlayerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new player' })
  @ApiBody({ type: RegisterPlayerCommand })
  @ApiResponse({
    status: 201,
    description: 'The player has been successfully created.',
    type: String,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Player with this email already exists.',
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
  @ApiOperation({ summary: 'Get a player by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Player ID' })
  @ApiResponse({
    status: 200,
    description: 'The player has been successfully retrieved.',
    type: Player,
  })
  @ApiResponse({ status: 404, description: 'Player not found.' })
  async getPlayer(@Param('id') id: string): Promise<Player> {
    return this.getPlayerService.execute(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a player' })
  @ApiParam({ name: 'id', type: 'string', description: 'Player ID' })
  @ApiBody({ type: UpdatePlayerCommand })
  @ApiResponse({
    status: 200,
    description: 'The player has been successfully updated.',
    type: Player,
  })
  @ApiResponse({ status: 404, description: 'Player not found.' })
  async updatePlayer(
    @Param('id') id: string,
    @Body() command: UpdatePlayerCommand,
  ): Promise<Player> {
    return this.updatePlayerService.execute(id, command);
  }
}
