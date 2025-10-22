import { ProdutosService } from './produtos.service';
import { ProdutosGatewayInMemory } from './gateways/produtos-gateway-in-memory';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let produtoGateway: ProdutosGatewayInMemory
  beforeAll(async () => {
    produtoGateway = new ProdutosGatewayInMemory()
    service = new ProdutosService(produtoGateway)
  });

  it('deve criar produto', async () => {
    const produto = await service.create({ estoque: 10, nome: 'Produto 1', descricao: 'Descricao 1', precoBase: 100 });
    expect(produto.data).toHaveProperty('id');
    expect(produto.data.nome).toBe('Produto 1');
  });
  it('deve listar os produtos', async () => {
    const produtos = await service.findMany();
    expect(produtos.data.length).toBe(1);
  });
  it('deve encontrar um produto', async () => {
    const produto = await service.findUnique('1');
    expect(produto.data).toHaveProperty('id', '1');
  });
  it('deve atualizar um produto', async () => {
    const produto = await service.update('1', { nome: 'Produto 1 Atualizado' });
    expect(produto.data.nome).toBe('Produto 1 Atualizado');
  })
  it('deve atualizar o desconto do produto', async () => {
    const produto = await service.updateDesconto('1', 15);
    expect(produto.data.descontoPercentual).toBe(15);
  })
  it('deve deletar um produto', async () => {
    const produto = await service.delete('1');
    expect(produto.data).toHaveProperty('id', '1');
  })
});
