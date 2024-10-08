// src/auth/application/use-cases/login-player.use-case.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginPlayerCommand {
  @ApiProperty({
    example: 'user@example.com',
    description: 'O email do jogador',
  })
  @IsEmail({}, { message: 'Por favor, forneça um endereço de email válido' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'A senha do jogador',
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;
}
