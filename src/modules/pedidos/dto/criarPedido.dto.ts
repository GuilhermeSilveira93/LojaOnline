import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CriarPedidoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clienteId: string;
}
