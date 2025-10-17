import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/prisma.service';

@Injectable()
export class AuthService {
  constructor(private db: PrismaService, private jwt: JwtService) { }

  async login(email: string, senha: string) {
    const user = await this.db.user.findUnique({ where: { S_EMAIL: email } });
    if (!user) throw new UnauthorizedException();
    const ok = await bcrypt.compare(senha, user.S_HASH_SENHA);
    if (!ok) throw new UnauthorizedException();
    return user
  }

  async changePassword(userId: string, senhaAtual: string, novaSenha: string) {
    const user = await this.db.user.findUnique({ where: { ID_USUARIO: userId } });
    if (!user) throw new UnauthorizedException();
    const ok = await bcrypt.compare(senhaAtual, user.S_HASH_SENHA);
    if (!ok) throw new BadRequestException('Senha atual incorreta');
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
