import { IsEnum } from 'class-validator';
import { PedidoStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class StatusPedidoDto {
  @ApiProperty({ name: 'status', enum: PedidoStatus })
  @IsEnum(PedidoStatus)
  status: PedidoStatus;
}
