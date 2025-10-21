import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { tryCatch } from 'src/common/patterns/try-catch';
import { th } from 'zod/v4/locales';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}

  async create(email: string, senha: string, role: Role) {
    const senhaHash = await bcrypt.hash(senha, 10);
    const [user, errorCreateUser] = await tryCatch(
      this.db.user.create({
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
        data: {
          role,
          email,
          senhaHash,
          nome: email,
        },
      }),
    );
    if (errorCreateUser) throw new BadRequestException('Erro ao criar usuário');
    return { success: true, message: 'Usuário criado com sucesso', data: user };
  }

  async login(email: string, senha: string) {
    const [user, error] = await tryCatch(
      this.db.user.findUnique({ where: { email } }),
    );
    if (error) throw new BadRequestException('Erro ao buscar usuário');
    if (!user) throw new NotFoundException();
    const ok = await bcrypt.compare(senha, user.senhaHash);
    if (!ok) throw new UnauthorizedException('Login ou senha inválidos');
    return {
      success: true,
      message: 'Login realizado com sucesso.',
      data: {
        token: this.jwt.sign(
          { sub: user.id, nome: user.nome, email: user.email, role: user.role },
          { algorithm: 'HS256' },
        ),
      },
    };
  }

  async changePassword(userId: string, novaSenha: string) {
    const [user, findUserError] = await tryCatch(
      this.db.user.findUnique({
        where: { id: userId },
      }),
    );
    if (!user || findUserError) throw new BadRequestException();
    const hash = await bcrypt.hash(novaSenha, 10);
    const [userAtual, e] = await tryCatch(
      this.db.user.update({
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
        where: { id: userId },
        data: { senhaHash: hash },
      }),
    );
    if (e) {
      throw new BadRequestException('Erro ao alterar a senha', {
        cause: e,
      });
    }
    return {
      message: 'Senha Alterada com sucesso',
      success: true,
      data: userAtual,
    };
  }
}
