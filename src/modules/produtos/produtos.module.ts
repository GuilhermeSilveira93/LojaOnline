import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosAtualizarDescontoController } from './controller/produtos-atualiza-desconto.controller';
import { ProdutosFindManyController } from './controller/produtos-find-many.controller';
import { ProdutosFindUniqueController } from './controller/produtos-find-unique.controller';
import { ProdutosUpdateController } from './controller/produtos-update.controller';
import { ProdutosCreateController } from './controller/produtos-create.controller';
import { ProdutosDeleteController } from './controller/produtos-delete.controller';
import { PRODUTOSGATEWAYINTERFACE } from './gateways/produtos-gateway-interface';
import { ProdutosGatewayPrisma } from './gateways/produtos-gateway-prisma';

@Module({
  providers: [
    ProdutosService,
    {
      provide: PRODUTOSGATEWAYINTERFACE,
      useClass: ProdutosGatewayPrisma,
    },
  ],
  controllers: [
    ProdutosFindManyController,
    ProdutosFindUniqueController,
    ProdutosAtualizarDescontoController,
    ProdutosUpdateController,
    ProdutosCreateController,
    ProdutosDeleteController,
  ],
})
export class ProdutosModule {}
