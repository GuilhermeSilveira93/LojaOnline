import { Module } from '@nestjs/common';
import { PedidosAtualizarStatusController } from './controller/pedidos-update-status.controller';
import { PedidosService } from './pedidos.service';
import { CarrinhoModule } from '../carrinho/carrinho.module';
import { EmailModule } from '../notificacoes/email.module';
import { PedidosCriarController } from './controller/pedidos-create-post.controller';
import { PedidosFindByClientIdController } from './controller/pedidos-find-by-client-id.controller';
import { PedidosFindByStatusController } from './controller/pedidos-find-by-status.controller';

@Module({
  imports: [EmailModule, CarrinhoModule],
  controllers: [
    PedidosAtualizarStatusController,
    PedidosCriarController,
    PedidosFindByClientIdController,
    PedidosFindByStatusController,
  ],
  providers: [PedidosService],
})
export class PedidosModule {}
