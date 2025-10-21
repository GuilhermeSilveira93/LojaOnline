import { Module } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import { CarrinhoDeleteController } from './controller/carrinho-delete.controller';
import { CarrinhoGetController } from './controller/carrinho-find-unique.controller';
import { CarrinhoAdicionarProdutoController } from './controller/carrinho-adicionar-produto.controller';
import { CarrinhoDeleteProdutoController } from './controller/carrinho-delete-produto.controller';

@Module({
  providers: [CarrinhoService],
  controllers: [
    CarrinhoDeleteController,
    CarrinhoGetController,
    CarrinhoAdicionarProdutoController,
    CarrinhoDeleteProdutoController,
  ],
  exports: [CarrinhoService],
})
export class CarrinhoModule {}
