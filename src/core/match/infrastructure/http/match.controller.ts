import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EditMatchService } from '../../application/services/edit-match.service';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { GetAllMatchesService } from '../../application/services/get-all-matches.service';
import { STATUS_MATCH } from '../../../../common/enums/status-match.enum';
import { ConfirmMatchCommand } from '../../application/commands/confirm-match.command';
import { RequestToPlayMatchService } from '../../application/services/request-to-play.service';
import { ConfirmMatchService } from '../../application/services/confirm-match.service';
import { CancelMatchService } from '../../application/services/cancel-match.service';
import { ListPendingRequestsMatchesService } from '../../application/services/list-pending-requests-matches.service';
import { GetPlayersMatchesService } from '../../application/services/get-players-matches.service';
import { Player } from '../../../player/domain/entitites/player.entity';
import { ApiCustomResponses } from '../../../../common/decorators/swagger/response.decorator';
import { MATCH_MESSAGES } from '../../../../common/constants/match.messages';
import { STATUS_CODES } from '../../../../common/enums/status-code.enum';
import { JWT } from '../../../../common/constants/jwt';
import { JwtAuth } from '../../../../common/decorators/auth/auth.decorator';
import { GetMatchesByPlayerService } from '../../application/services/get-matches-by-player.service';

@ApiTags('Partidas')
@Controller('partidas')
export class MatchController {
  constructor(
    private readonly createService: CreateMatchService,
    private readonly editMatchService: EditMatchService,
    private readonly getAllMatchesService: GetAllMatchesService,
    private readonly requestToPlayService: RequestToPlayMatchService,
    private readonly confirmMatchService: ConfirmMatchService,
    private readonly cancelMatchService: CancelMatchService,
    private readonly listPendingRequestsService: ListPendingRequestsMatchesService,
    private readonly getAllMatchesPlayerService: GetPlayersMatchesService,
    private readonly getMatchesByPlayerService: GetMatchesByPlayerService,
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
  @JwtAuth()
  async createMatch(@Body() command: CreateMatchCommand) {
    const matchId = await this.createService.execute(command);
    return { id: matchId };
  }

  @Put(':id')
  @ApiOperation({ summary: MATCH_MESSAGES.EDIT_MATCH_SUCCESS })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ type: EditMatchCommand })
  @ApiCustomResponses(MATCH_MESSAGES.EDIT_MATCH_SUCCESS)
  @JwtAuth()
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
  @JwtAuth()
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
  @JwtAuth()
  async getPlayerMatches(
    @Param('playerId') playerId: string,
    @Query('status') status?: STATUS_MATCH,
  ) {
    const query = { playerId, status };
    return this.getMatchesByPlayerService.execute(query);
  }

  @Post(':id/solicitar-para-jogar')
  @ApiOperation({ summary: MATCH_MESSAGES.REQUEST_TO_PLAY })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiCustomResponses(MATCH_MESSAGES.SUCCESS_REQUEST_PLAY)
  @JwtAuth()
  async requestToPlayMatch(
    @Param('id') id: string,
    @Body('playerId') playerId: string,
  ) {
    const command = new ConfirmMatchCommand(id, playerId);
    await this.requestToPlayService.execute(command);
    return { message: MATCH_MESSAGES.SUCCESS_REQUEST_PLAY };
  }

  @Post(':id/confirmar-jogador')
  @ApiOperation({ summary: MATCH_MESSAGES.CONFIRM_MATCH })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiCustomResponses(MATCH_MESSAGES.SUCCESS_CONFIRM)
  @JwtAuth()
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
  @JwtAuth()
  async cancelMatch(@Param('id') id: string) {
    await this.cancelMatchService.execute(id);
    return { message: MATCH_MESSAGES.SUCCESS_CANCEL };
  }

  @Get(':id/solicitacoes')
  @ApiOperation({ summary: MATCH_MESSAGES.RETURN_PENDING_REQUESTS })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiResponse({
    status: STATUS_CODES.OK,
    description: MATCH_MESSAGES.RETURN_PENDING_REQUESTS,
    type: [String],
  })
  @ApiResponse({
    status: STATUS_CODES.NOT_FOUND,
    description: MATCH_MESSAGES.ERROR_NOT_FOUND,
  })
  @JwtAuth()
  async listPendingRequests(@Param('id') id: string) {
    return this.listPendingRequestsService.execute(id);
  }

  @Get(':id/jogadores')
  @ApiOperation({ summary: MATCH_MESSAGES.LIST_ALL_MATCHES_PLAYER })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiCustomResponses(MATCH_MESSAGES.LIST_MATCHES_PLAYER_SUCCESS)
  @ApiBearerAuth(JWT)
  async getMatchPlayers(@Param('id') id: string): Promise<Player[]> {
    return this.getAllMatchesPlayerService.execute(id);
  }
}
