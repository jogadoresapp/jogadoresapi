import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class UpdatePlayerCommand {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  @MinLength(2, { message: 'O apelido deve ter pelo menos 2 caracteres.' })
  nickname?: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Por favor, forneça um endereço de e-mail válido.' })
  email?: string;

  @ApiProperty({ required: false })
  position?: string;

  @ApiProperty({ required: false })
  dominantFoot?: string;

  @ApiProperty({ required: false })
  preferredSchedule?: string[];

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  state?: string;
}
