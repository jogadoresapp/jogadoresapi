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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EditMatchService } from '../../application/services/edit-match.service';
import { EditMatchCommand } from '../../application/commands/edit-match.command';
import { GetAllMatchesService } from '../../application/services/get-all-matches.service';
import { JoinMatchService } from '../../application/services/join-match.service';
import { CancelMatchService } from '../../application/services/cancel-match.service';
import { ApiCustomResponses } from '../../../../common/decorators/swagger/response.decorator';
import { MATCH_MESSAGES } from '../../../../common/constants/match.messages';
import { STATUS_CODES } from '../../../../common/enums/status-code.enum';
import { GetMatchByIdService } from '../../application/services/get-match-by-id.service';
import { GetAllMatchesCommand } from '../../application/commands/get-all-matches.command';
import { LeaveMatchService } from '../../application/services/leave-match.service';
import { MatchCommand } from '../../application/commands/match.command';
import { Player } from 'src/core/player/domain/entities/player.entity';
import { GetPlayersFromMatchService } from '../../application/services/get-players-from-match.service';
import { GetMatchesFromPlayerService } from '../../application/services/get-matches-from-player.service';
import { Match } from '../../domain/entities/match.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Partidas')
@Controller('partidas')
export class MatchController {
  constructor(
    private readonly createService: CreateMatchService,
    private readonly editMatchService: EditMatchService,
    private readonly getAllMatchesService: GetAllMatchesService,
    private readonly joinMatchService: JoinMatchService,
    private readonly leaveMatchService: LeaveMatchService,
    private readonly getMatchByIdService: GetMatchByIdService,
    private readonly cancelMatchService: CancelMatchService,
    private readonly getPlayersFromMatchService: GetPlayersFromMatchService,
    private readonly getMatchesFromPlayerService: GetMatchesFromPlayerService,
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
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('jwt')
  async createMatch(@Body() command: CreateMatchCommand) {
    const matchId = await this.createService.execute(command);
    return { id: matchId };
  }

  @Put(':id')
  @ApiOperation({ summary: MATCH_MESSAGES.EDIT_MATCH_SUCCESS })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ type: EditMatchCommand })
  @ApiCustomResponses(MATCH_MESSAGES.EDIT_MATCH_SUCCESS)
  @UseGuards(AuthGuard('jwt'))
  async editMatch(
    @Param('id') id: string,
    @Body() command: Partial<EditMatchCommand>,
  ) {
    await this.editMatchService.execute(id, command);
    return { message: MATCH_MESSAGES.EDIT_MATCH_SUCCESS };
  }

  @Get()
  @ApiOperation({ summary: MATCH_MESSAGES.LIST_ALL_MATCHES })
  @ApiCustomResponses(MATCH_MESSAGES.LIST_ALL_MATCHES)
  @UseGuards(AuthGuard('jwt'))
  async getAllMatches(@Query() filters: GetAllMatchesCommand) {
    return this.getAllMatchesService.execute(filters);
  }

  @Post(':matchId/entrar-na-partida')
  @ApiOperation({ summary: MATCH_MESSAGES.CONFIRM_MATCH })
  @ApiParam({ name: 'matchId', description: 'Partida ID' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiCustomResponses(MATCH_MESSAGES.SUCCESS_CONFIRM)
  @UseGuards(AuthGuard('jwt'))
  async joinMatch(
    @Param('matchId') matchId: string,
    @Body('playerId') playerId: string,
  ) {
    const command = new MatchCommand(matchId, playerId);
    await this.joinMatchService.execute(command);
    return { message: MATCH_MESSAGES.SUCCESS_CONFIRM };
  }

  @Post(':matchId/sair-da-partida')
  @ApiOperation({ summary: MATCH_MESSAGES.CONFIRM_MATCH })
  @ApiParam({ name: 'matchId', description: 'Partida ID' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiCustomResponses(MATCH_MESSAGES.SUCCESS_CONFIRM)
  @UseGuards(AuthGuard('jwt'))
  async leaveMatch(
    @Param('matchId') matchId: string,
    @Body('playerId') playerId: string,
  ) {
    const command = new MatchCommand(matchId, playerId);
    await this.leaveMatchService.execute(command);
    return { message: MATCH_MESSAGES.SUCCESS_CONFIRM };
  }

  @Delete(':id')
  @ApiOperation({ summary: MATCH_MESSAGES.CANCEL_MATCH })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiBody({ schema: { properties: { playerId: { type: 'string' } } } })
  @ApiCustomResponses(MATCH_MESSAGES.SUCCESS_CANCEL)
  // @UseGuards(AuthGuard('jwt'))
  async cancelMatch(@Param('id') id: string) {
    await this.cancelMatchService.execute(id);
    return { message: MATCH_MESSAGES.SUCCESS_CANCEL };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pegar partida pelo ID' })
  @ApiParam({ name: 'id', description: 'Partida ID' })
  @ApiCustomResponses('Pegar partida pelo ID')
  // @UseGuards(AuthGuard('jwt'))
  async getMatchById(@Param('id') id: string) {
    return this.getMatchByIdService.execute(id);
  }

  @Get(':matchId/jogadores')
  @ApiOperation({ summary: MATCH_MESSAGES.LIST_ALL_MATCHES_PLAYER })
  @ApiParam({ name: 'matchId', description: 'Partida ID' })
  @ApiCustomResponses(MATCH_MESSAGES.LIST_MATCHES_PLAYER_SUCCESS)
  // @UseGuards(AuthGuard('jwt'))
  async getMatchPlayers(@Param('matchId') matchId: string): Promise<Player[]> {
    return this.getPlayersFromMatchService.execute(matchId);
  }

  @Get(':playerId/partidas')
  @ApiOperation({ summary: MATCH_MESSAGES.LIST_ALL_MATCHES_PLAYER })
  @ApiParam({ name: 'playerId', description: 'Jogador ID' })
  @ApiCustomResponses(MATCH_MESSAGES.LIST_MATCHES_PLAYER_SUCCESS)
  // @UseGuards(AuthGuard('jwt'))
  async getMatchesFromPlayers(
    @Param('playerId') playerId: string,
  ): Promise<Match[]> {
    return this.getMatchesFromPlayerService.execute(playerId);
  }
}
