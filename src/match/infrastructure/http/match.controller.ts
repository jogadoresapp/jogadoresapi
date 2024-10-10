import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateMatchService } from '../../application/services/create-match.service';
import { CreateMatchCommand } from '../../application/commands/create-match.command';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EditMatchService } from '../../application/services/edit-match.service';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { GetAllMatchesService } from '../../application/services/get-all-matches.service';
import { STATUS_MATCH } from '../../../common/enums/status-match.enum';
import { GetPlayerMatchesService } from '../../application/services/get-player-matches.service';
import { ConfirmMatchCommand } from '../../application/commands/confirm-match.command';
import { RequestToPlayMatchService } from '../../application/services/request-to-play.service';
import { ConfirmMatchService } from '../../application/services/confirm-match.service';
import { CancelMatchService } from '../../application/services/cancel-match.service';
import { ListPendingRequestsMatchesService } from '../../application/services/list-pending-requests-matches.service';
import { AuthGuard } from '@nestjs/passport';
import { GetPlayersMatchesService } from '../../application/services/get-players-matches.service';
import { Player } from '../../../player/domain/entitites/player.entity';

@ApiTags('Partidas')
@Controller('matches')
export class MatchController {
  constructor(
    private readonly createService: CreateMatchService,
    private readonly editMatchService: EditMatchService,
    private readonly getAllMatchesService: GetAllMatchesService,
    private readonly getPlayerMatchesService: GetPlayerMatchesService,
    private readonly requestToPlayService: RequestToPlayMatchService,
    private readonly confirmMatchService: ConfirmMatchService,
    private readonly cancelMatchService: CancelMatchService,
    private readonly listPendingRequestsService: ListPendingRequestsMatchesService,
    private readonly getAllMatchesPlayerService: GetPlayersMatchesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova partida' })
  @ApiBody({ type: CreateMatchCommand })
  @ApiResponse({
    status: 201,
    description: 'A partida foi criada com sucesso.',
    schema: {
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @UseGuards(AuthGuard('jwt'))
  async createMatch(@Body() command: CreateMatchCommand) {
    const matchId = await this.createService.execute(command);
    return { id: matchId };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar uma partida existente' })
  @ApiParam({ name: 'id', description: 'ID da partida', type: 'string' })
  @ApiBody({ type: EditMatchCommand })
  @ApiResponse({ status: 200, description: 'Partida atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada.' })
  async editMatch(
    @Param('id') id: string,
    @Body() command: Partial<EditMatchCommand>,
  ) {
    await this.editMatchService.execute(id, command);
    return { message: 'Partida atualizada com sucesso' };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as partidas' })
  @ApiQuery({
    name: 'status',
    enum: STATUS_MATCH,
    required: false,
    description: 'Filtrar partidas por status',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de partidas',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          dateGame: { type: 'string', example: '2021-08-01T16:00:00.000Z' },
          location: { type: 'string', example: 'Campo de futebol' },
          availableSpots: { type: 'number', example: 10 },
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  async getAllMatches(@Query('status') status: STATUS_MATCH) {
    return this.getAllMatchesService.execute(status);
  }

  @Get('player/:playerId')
  @ApiOperation({ summary: 'Listar partidas de um jogador' })
  @ApiParam({ name: 'playerId', description: 'ID do jogador', type: 'string' })
  @ApiQuery({
    name: 'status',
    enum: STATUS_MATCH,
    required: false,
    description: 'Filtrar partidas por status',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de partidas do jogador',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          dateGame: { type: 'string', example: '2021-08-01T16:00:00.000Z' },
          location: { type: 'string', example: 'Campo de futebol' },
          availableSpots: { type: 'number', example: 10 },
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  async getPlayerMatches(
    @Param('playerId') playerId: string,
    @Query('status') status?: STATUS_MATCH,
  ) {
    const query = { playerId, status };
    return this.getPlayerMatchesService.execute(query);
  }

  @Post(':id/request-to-play')
  @ApiOperation({ summary: 'Solicitar participação em uma partida' })
  @ApiParam({ name: 'id', description: 'ID da partida', type: 'string' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Solicitação enviada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada.' })
  @UseGuards(AuthGuard('jwt'))
  async requestToPlayMatch(
    @Param('id') id: string,
    @Body('playerId') playerId: string,
  ) {
    const command = new ConfirmMatchCommand(id, playerId);
    await this.requestToPlayService.execute(command);
    return { message: 'Solicitação para jogar enviada com sucesso' };
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirmar participação de um jogador na partida' })
  @ApiParam({ name: 'id', description: 'ID da partida', type: 'string' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Jogador confirmado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada.' })
  @UseGuards(AuthGuard('jwt'))
  async confirmMatch(
    @Param('id') id: string,
    @Body('playerId') playerId: string,
  ) {
    const command = new ConfirmMatchCommand(id, playerId);
    await this.confirmMatchService.execute(command);
    return { message: 'Jogador confirmado para a partida com sucesso' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar uma partida' })
  @ApiParam({ name: 'id', description: 'ID da partida', type: 'string' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Partida cancelada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada.' })
  @UseGuards(AuthGuard('jwt'))
  async cancelMatch(
    @Param('id') id: string,
    @Body('playerId') playerId: string,
  ) {
    await this.cancelMatchService.execute(id, playerId);
    return { message: 'Partida cancelada com sucesso' };
  }

  @Get(':id/pending-requests')
  @ApiOperation({ summary: 'List pending requests for a match' })
  @ApiParam({ name: 'id', type: 'string', description: 'Match ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of player IDs with pending requests',
    type: [String],
  })
  @ApiResponse({ status: 404, description: 'Match not found' })
  @UseGuards(AuthGuard('jwt'))
  async listPendingRequests(@Param('id') id: string) {
    return this.listPendingRequestsService.execute(id);
  }

  @Get(':id/players')
  @ApiOperation({ summary: 'Get all players of a match' })
  @ApiParam({ name: 'id', description: 'Match ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of players',
    type: [Player],
  })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async getMatchPlayers(@Param('id') id: string): Promise<Player[]> {
    return this.getAllMatchesPlayerService.execute(id);
  }
}
