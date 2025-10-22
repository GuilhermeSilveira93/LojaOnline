import {
  Injectable,
  Inject,
} from '@nestjs/common';
import { CriarProdutoDto } from './dto/criarProduto.dto';
import { AtualizarProdutoDto } from './dto/AtualizarProduto.dto';
import { PRODUTOSGATEWAYINTERFACE, ProdutosGatewayInterface } from './gateways/produtos-gateway-interface';
import { Produto } from './entities/produto.entitie';

@Injectable()
export class ProdutosService {
  constructor(
    @Inject(PRODUTOSGATEWAYINTERFACE)
    private produtoGateway: ProdutosGatewayInterface
  ) { }

  async create(dto: CriarProdutoDto) {
    const novoProduto = new Produto(dto)
    const produto = await this.produtoGateway.create(novoProduto)
    return {
      success: true,
      data: produto,
      message: 'Produto incluido com sucesso!',
    };
  }
  async findMany() {
    const produtos = await this.produtoGateway.findMany()
    return {
      success: true,
      message: 'Produtos Encontrados',
      data: produtos,
    };
  }
  async findUnique(id: string) {
    const produto = await this.produtoGateway.findUnique(id)
    return {
      success: true,
      data: produto,
      message: 'Produto encontrado!',
    };
  }
  async update(id: string, dto: AtualizarProdutoDto) {
    const produto = await this.produtoGateway.update(id, dto)
    return {
      success: true,
      data: produto,
      message: 'Produto atualizado!',
    };
  }
  async delete(id: string) {
    const produto = await this.produtoGateway.delete(id)
    return {
      success: true,
      data: produto,
      message: 'Produto deletado!',
    };
  }

  async updateDesconto(idProduto: string, desconto: number) {
    const produto = await this.produtoGateway.updateDesconto(idProduto, desconto)
    return {
      success: true,
      data: produto,
      message: 'Desconto atualizado no produto!',
    };
  }
}
