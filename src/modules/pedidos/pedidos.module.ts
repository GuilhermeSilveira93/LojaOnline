import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { CarrinhoModule } from '../carrinho/carrinho.module';
import { EmailModule } from '../notificacoes/email.module';

@Module({
  imports: [EmailModule, CarrinhoModule],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
