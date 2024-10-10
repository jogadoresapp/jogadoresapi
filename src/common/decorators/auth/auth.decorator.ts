import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWT } from '../../constants/jwt';

export function JwtAuth() {
  return applyDecorators(UseGuards(AuthGuard(JWT)), ApiBearerAuth(JWT));
}
