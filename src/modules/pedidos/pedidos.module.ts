import { Module } from '@nestjs/common';
import { PedidosAtualizarStatusController } from './controller/pedidos-update-status.controller';
import { PedidosService } from './pedidos.service';
import { CarrinhoModule } from '../carrinho/carrinho.module';
import { EmailModule } from '../notificacoes/email.module';
import { PedidosCriarController } from './controller/pedidos-create-post.controller';
import { PedidosFindByClientIdController } from './controller/pedidos-find-by-client-id.controller';
import { PedidosFindByStatusController } from './controller/pedidos-find-by-status.controller';
import { PEDIDOSSGATEWAYINTERFACE } from './gateways/pedidos-gateway-interface';
import { PedidosGatewayPrisma } from './gateways/pedidos-gateway-prisma';

@Module({
  imports: [EmailModule, CarrinhoModule],
  controllers: [
    PedidosAtualizarStatusController,
    PedidosCriarController,
    PedidosFindByClientIdController,
    PedidosFindByStatusController,
  ],
  providers: [
    PedidosService,
    {
      provide: PEDIDOSSGATEWAYINTERFACE,
      useClass: PedidosGatewayPrisma
    }
  ],
})
export class PedidosModule {}
