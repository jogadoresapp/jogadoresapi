import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { MATCH_MESSAGES } from './../../constants/match.messages';
import { STATUS_CODES } from '../../../common/enums/status-code.enum';

export function ApiCustomResponses(successMessage: string) {
  return applyDecorators(
    ApiResponse({ status: STATUS_CODES.OK, description: successMessage }),
    ApiResponse({
      status: STATUS_CODES.BAD_REQUEST,
      description: MATCH_MESSAGES.ERROR_BAD_REQUEST,
    }),
    ApiResponse({
      status: STATUS_CODES.NOT_FOUND,
      description: MATCH_MESSAGES.ERROR_NOT_FOUND,
    }),
  );
}
