import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class EditMatchCommand {
  @ApiPropertyOptional({
    description: 'A nova data da partida',
    example: '2023-07-15T14:30:00Z',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  public dateGame?: string;

  @ApiPropertyOptional({
    description: 'Novo lugar da partida',
    example: 'estrela',
    type: String,
  })
  @IsOptional()
  @IsString()
  public location?: string;

  @ApiPropertyOptional({
    description: 'Novas vagas disponíveis',
    example: 10,
    minimum: 1,
    maximum: 22,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(22)
  public availableSpots?: number;
}
