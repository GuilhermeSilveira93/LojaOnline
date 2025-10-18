import { Test } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { PrismaService } from '../../shared/prisma.service';

describe('ProdutosService', () => {
  let service: ProdutosService;
  const prisma = {
    produto: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProdutosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get(ProdutosService);
  });

  it('deve criar produto', async () => {
    prisma.produto.create.mockResolvedValue({ id: '1', nome: 'X' });
    const res = await service.criar({
      S_NOME: 'X',
      S_DESCRICAO: '',
      N_PRECOBASE: 10,
      N_ESTOQUE: 5,
      S_ATIVO: true,
    });
    expect(res).toEqual({ id: '1', nome: 'X' });
  });
});
