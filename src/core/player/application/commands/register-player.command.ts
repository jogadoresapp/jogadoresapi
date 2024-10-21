import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import {
  PlayerDominantFoot,
  PlayerPosition,
  PlayerPreferredDays,
  PlayerPreferredSchedule,
} from '../../domain/enums/player';

export class RegisterPlayerCommand {
  @ApiProperty()
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
  name: string;

  @ApiProperty()
  @MinLength(2, { message: 'O apelido deve ter pelo menos 2 caracteres.' })
  nickname: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Por favor, forneça um endereço de e-mail válido.' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @ApiProperty({
    enum: PlayerPosition,
    description: 'Posição do jogador (ZAGUEIRO, MEIA, ATACANTE)',
    enumName: 'PlayerPosition',
  })
  @IsEnum(PlayerPosition, {
    each: true,
    message:
      'A posição deve ser um dos seguintes valores: ZAGUEIRO, MEIA, ATACANTE',
  })
  position: PlayerPosition[];

  @ApiProperty({
    enum: PlayerDominantFoot,
    description: 'Pé dominante do jogador (LEFT, RIGHT)',
    enumName: 'PlayerDominantFoot',
  })
  @IsEnum(PlayerDominantFoot, {
    message: 'O pé dominante deve ser um dos seguintes valores: LEFT, RIGHT',
  })
  dominantFoot: PlayerDominantFoot;

  @ApiProperty({
    enum: PlayerPreferredSchedule,
    description: 'Horário preferido do jogador (MANHA, TARDE, NOITE)',
    enumName: 'PlayerPreferredSchedule',
    isArray: true,
  })
  @IsEnum(PlayerPreferredSchedule, {
    each: true,
    message:
      'O horário preferido deve ser um dos seguintes valores: MANHA, TARDE, NOITE',
  })
  preferredSchedule: PlayerPreferredSchedule[];

  @ApiProperty({
    enum: PlayerPreferredDays,
    description: 'Dias preferidos do jogador (SEGUNDA, TERCA, QUARTA, etc.)',
    enumName: 'PlayerPreferredDays',
    isArray: true,
  })
  @IsEnum(PlayerPreferredDays, {
    each: true,
    message:
      'Os dias preferidos devem ser um dos seguintes valores: SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA, SABADO, DOMINGO',
  })
  preferredDays: PlayerPreferredDays[];

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;
}
