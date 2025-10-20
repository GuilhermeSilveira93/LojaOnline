import { PedidoStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ObterPorStatusDto {
  @IsEnum(PedidoStatus) status: PedidoStatus;
}
