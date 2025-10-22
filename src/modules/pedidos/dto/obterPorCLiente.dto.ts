import { ApiProperty } from '@nestjs/swagger';
import { PedidoStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ObterPorStatusDto {
  @ApiProperty({ name: 'status', enum: PedidoStatus })
  @IsEnum(PedidoStatus)
  status: PedidoStatus;
}
