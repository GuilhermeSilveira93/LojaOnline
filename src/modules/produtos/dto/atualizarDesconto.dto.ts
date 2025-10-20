import { IsInt, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarDescontoDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(99)
  desconto: number;
}
