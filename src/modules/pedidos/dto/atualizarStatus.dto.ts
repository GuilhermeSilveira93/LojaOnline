import { IsEnum } from 'class-validator';
import { PedidoStatus } from '@prisma/client';

export class StatusPedidoDto {
  @IsEnum(PedidoStatus) status: PedidoStatus;
}
