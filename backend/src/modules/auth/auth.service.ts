import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) { }

  async create(email: string, senha: string, role: Role) {
    const senhaHash = await bcrypt.hash(senha, 10);
    try {
      return await this.db.user.create({
        data: {
          role,
          email,
          senhaHash,
          nome: email,
        },
      });
    } catch (error) {
      let message = error.message;
      switch (error.code) {
        case 'P2002':
          message = 'Usuário com este email já existe';
          break;

        default:
          break;
      }
      throw new ConflictException(message);
    }
  }

  async login(email: string, senha: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException();
    const ok = await bcrypt.compare(senha, user.senhaHash);
    if (!ok) throw new UnauthorizedException();

    return {
      ...user,
      token: this.jwt.sign({ sub: user.id, ...user }, { algorithm: 'HS256' }),
    };
  }

  async changePassword(userId: string, novaSenha: string) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException();
    const hash = await bcrypt.hash(novaSenha, 10);
    await this.db.user.update({
      where: { id: userId },
      data: { senhaHash: hash },
    });
    return { message: 'Senha Alterada com sucesso', success: true };
  }

  async adminChangePassword(userId: string, novaSenha: string) {
    const hash = await bcrypt.hash(novaSenha, 10);
    await this.db.user.update({
      where: { id: userId },
      data: { senhaHash: hash },
    });
    return { message: 'Senha Alterada com sucesso', success: true };
  }
}
