import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import PrismaModule from 'src/shared/prisma.module';
import EnvModule from 'src/common/Env/env.module';
import { ProdutosModule } from './produtos/produtos.module';
import { ClientesModule } from './clientes/clientes.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    EnvModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProdutosModule,
    ClientesModule,
    CarrinhoModule,
    PedidosModule,
    CarrinhoModule
  ],
})
export class AppModule {}
