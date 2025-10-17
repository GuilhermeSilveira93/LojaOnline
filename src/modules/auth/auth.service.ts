import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private db: PrismaService, private jwt: JwtService) { }


  async createUser(email: string, senha: string, E_ROLE: Role) {
    const S_HASH_SENHA = await bcrypt.hash(senha, 10)
    try {
      await this.db.user.create({
        data: {
          E_ROLE,
          S_EMAIL: email,
          S_HASH_SENHA,
          S_NOME: email,
        }
      })
    } catch (error) {
      let message = error.message
      switch (error.code) {
        case 'P2002':
          message = "Usuário com este email já existe"
          break;

        default:
          break;
      }
      throw new ConflictException(message)
    }
    return { message: `${E_ROLE} incluido com sucesso`, success: true };
  }

  async login(email: string, senha: string) {
    const user = await this.db.user.findUnique({ where: { S_EMAIL: email } });
    if (!user) throw new UnauthorizedException();
    const ok = await bcrypt.compare(senha, user.S_HASH_SENHA);
    if (!ok) throw new UnauthorizedException();
    
    return { ...user, token: this.jwt.sign({ sub: user.ID_USUARIO, ...user }, { algorithm: 'HS256' }) }
  }

  async changePassword(userId: string, novaSenha: string) {
    const user = await this.db.user.findUnique({ where: { ID_USUARIO: userId } });
    if (!user) throw new UnauthorizedException();
    const hash = await bcrypt.hash(novaSenha, 10);
    await this.db.user.update({ where: { ID_USUARIO: userId }, data: { S_HASH_SENHA: hash } });
    return { message: 'Senha Alterada com sucesso', success: true };
  }

  async adminChangePassword(userId: string, novaSenha: string) {
    const hash = await bcrypt.hash(novaSenha, 10);
    await this.db.user.update({ where: { ID_USUARIO: userId }, data: { S_HASH_SENHA: hash } });
    return { message: 'Senha Alterada com sucesso', success: true };
  }
}
