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
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { GetPlayerMatchesService } from '../../application/services/get-player-matches.service';
import { ConfirmMatchCommand } from '../../application/commands/confirm-match.command';
import { RequestToPlayMatchService } from '../../application/services/request-to-play.service';
import { ConfirmMatchService } from '../../application/services/confirm-match.service';
import { CancelMatchService } from '../../application/services/cancel-match.service';
import { ListPendingRequestsMatchesService } from '../../application/services/list-pending-requests-matches.service';
import { AuthGuard } from '@nestjs/passport';
import { GetPlayersMatchesService } from '../../application/services/get-players-matches.service';
import { Player } from '../../../player/domain/entitites/player.entity';
import { ApiCustomResponses } from 'src/common/decorators/swagger/response.decorator';
import { MATCH_MESSAGES } from 'src/common/constants/match.messages';
import { STATUS_CODES } from 'src/common/enums/status-code.enum';
import { JWT } from 'src/common/constants/jwt';

@ApiTags('Partidas')
@Controller('partidas')
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
  @ApiOperation({ summary: MATCH_MESSAGES.CREATE_NEW_MATCH })
  @ApiBody({ type: CreateMatchCommand })
  @ApiResponse({
    status: STATUS_CODES.CREATED,
    description: MATCH_MESSAGES.SUCCESS_CREATE,
  })
  @ApiResponse({
    status: STATUS_CODES.BAD_REQUEST,
    description: MATCH_MESSAGES.ERROR_BAD_REQUEST,
  })
  @UseGuards(AuthGuard(JWT))
  async createMatch(@Body() command: CreateMatchCommand) {
    const matchId = await this.createService.execute(command);
    return { id: matchId };
  }

  @Put(':id')
  @ApiOperation({ summary: MATCH_MESSAGES.EDIT_MATCH_SUCCESS })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ type: EditMatchCommand })
  @ApiCustomResponses(MATCH_MESSAGES.EDIT_MATCH_SUCCESS)
  async editMatch(
    @Param('id') id: string,
    @Body() command: Partial<EditMatchCommand>,
  ) {
    await this.editMatchService.execute(id, command);
    return { message: MATCH_MESSAGES.EDIT_MATCH_SUCCESS };
  }

  @Get()
  @ApiOperation({ summary: MATCH_MESSAGES.LIST_ALL_MATCHES })
  @ApiQuery({
    name: 'status',
    enum: STATUS_MATCH,
    required: true,
    description: MATCH_MESSAGES.FILTER_MATCH_BY_STATUS,
  })
  @ApiCustomResponses(MATCH_MESSAGES.LIST_ALL_MATCHES)
  @UseGuards(AuthGuard(JWT))
  async getAllMatches(@Query('status') status: STATUS_MATCH) {
    return this.getAllMatchesService.execute(status);
  }

  @Get('jogador/:playerId')
  @ApiOperation({ summary: MATCH_MESSAGES.LIST_MATCHES_PLAYER })
  @ApiParam({ name: 'playerId', description: 'ID do jogador' })
  @ApiQuery({
    name: 'status',
    enum: STATUS_MATCH,
    required: true,
    description: MATCH_MESSAGES.FILTER_MATCH_BY_STATUS,
  })
  @ApiCustomResponses(MATCH_MESSAGES.LIST_MATCHES_PLAYER)
  @UseGuards(AuthGuard(JWT))
  async getPlayerMatches(
    @Param('playerId') playerId: string,
    @Query('status') status?: STATUS_MATCH,
  ) {
    const query = { playerId, status };
    return this.getPlayerMatchesService.execute(query);
  }

  @Post(':id/solicitar-para-jogar')
  @ApiOperation({ summary: MATCH_MESSAGES.REQUEST_TO_PLAY })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiCustomResponses(MATCH_MESSAGES.SUCCESS_REQUEST_PLAY)
  @UseGuards(AuthGuard(JWT))
  async requestToPlayMatch(
    @Param('id') id: string,
    @Body('playerId') playerId: string,
  ) {
    const command = new ConfirmMatchCommand(id, playerId);
    await this.requestToPlayService.execute(command);
    return { message: MATCH_MESSAGES.SUCCESS_REQUEST_PLAY };
  }

  @Post(':id/confirmar-jogador')
  @ApiOperation({ summary: 'Confirmar participação de um jogador na partida' })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiCustomResponses(MATCH_MESSAGES.SUCCESS_CONFIRM)
  @UseGuards(AuthGuard(JWT))
  async confirmMatch(
    @Param('id') id: string,
    @Body('playerId') playerId: string,
  ) {
    const command = new ConfirmMatchCommand(id, playerId);
    await this.confirmMatchService.execute(command);
    return { message: MATCH_MESSAGES.SUCCESS_CONFIRM };
  }

  @Delete(':id')
  @ApiOperation({ summary: MATCH_MESSAGES.CANCEL_MATCH })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiCustomResponses(MATCH_MESSAGES.SUCCESS_CANCEL)
  @UseGuards(AuthGuard(JWT))
  async cancelMatch(
    @Param('id') id: string,
    @Body('playerId') playerId: string,
  ) {
    await this.cancelMatchService.execute(id, playerId);
    return { message: MATCH_MESSAGES.SUCCESS_CANCEL };
  }

  @Get(':id/solicitacoes')
  @ApiOperation({ summary: 'List pending requests for a match' })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiResponse({
    status: STATUS_CODES.OK,
    description: 'Returns a list of player IDs with pending requests',
    type: [String],
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND,
    description: MATCH_MESSAGES.ERROR_NOT_FOUND,
  })
  @UseGuards(AuthGuard(JWT))
  async listPendingRequests(@Param('id') id: string) {
    return this.listPendingRequestsService.execute(id);
  }

  @Get(':id/jogadores')
  @ApiOperation({ summary: MATCH_MESSAGES.LIST_ALL_MATCHES_PLAYER })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiCustomResponses(MATCH_MESSAGES.LIST_MATCHES_PLAYER_SUCCESS)
  async getMatchPlayers(@Param('id') id: string): Promise<Player[]> {
    return this.getAllMatchesPlayerService.execute(id);
  }
}
