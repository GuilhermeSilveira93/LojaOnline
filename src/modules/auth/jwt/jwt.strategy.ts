import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from 'src/common/Env/env.service';
import * as zod from 'zod';
const tokenSchema = zod.object({
  sub: zod.string(),
  nome: zod.string(),
  email: zod.string(),
  role: zod.string(),
});
export type tokenSchemaType = zod.infer<typeof tokenSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const secretOrKey = env.get('JWT_PRIVATE_KEY');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['HS256'],
      secretOrKey,
    });
  }

  async validate(payload: tokenSchemaType) {
    const res = tokenSchema.safeParse(payload);
    if (!res.success) {
      throw new UnauthorizedException('Invalid JWT payload'); // evita 500
    }
    const p = res.data;
    return p;
  }
}
