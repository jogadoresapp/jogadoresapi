import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlayerCommand {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  email?: string;
}
