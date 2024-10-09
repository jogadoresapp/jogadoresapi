import { Body, Controller, Post } from '@nestjs/common';
import { CreateMatchService } from '../../services/create-match.service';
import { CreateMatchCommand } from '../../commands/create-match.command';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

ApiTags('matches');
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: CreateMatchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiBody({ type: CreateMatchCommand })
  @ApiResponse({
    status: 201,
    description: 'The match has been successfully created.',
    schema: {
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createMatch(@Body() command: CreateMatchCommand) {
    const matchId = await this.matchService.execute(command);
    return { id: matchId };
  }
}
