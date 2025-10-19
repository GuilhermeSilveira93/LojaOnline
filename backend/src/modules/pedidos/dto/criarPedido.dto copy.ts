import { IsNotEmpty, IsString } from 'class-validator';

export class CriarPedidoDto {
  @IsString()
  @IsNotEmpty()
  clienteId: string;
}

