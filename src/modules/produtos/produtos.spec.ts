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
    const res = await service.create({
      nome: 'X',
      descricao: '',
      precoBase: 10,
      estoque: 5,
      ativo: true,
    });
    expect(res).toEqual({
      success: true,
      data: { id: '1', nome: 'X' },
      message: expect.any(String),
    });
  });
  it('deve deletar produto', async () => {
    prisma.produto.delete.mockResolvedValue({ ok: true });
    const res = await service.delete('1');
    expect(res).toEqual({
      success: true,
      data: { ok: true },
      message: expect.any(String),
    });
  });
});
