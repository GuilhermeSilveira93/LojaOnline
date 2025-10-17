import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvService } from 'src/common/Env/env.service'
import * as zod from 'zod'
const tokenSchema = zod.object({
  sub: zod.string(),
  ID_USUARIO: zod.string(),
  S_NOME: zod.string(),
  ID_GRUPO: zod.string(),
  st_grupo: zod.object({
    N_NIVEL: zod.number(),
  }),
})
export type tokenSchemaType = zod.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const secretOrKey = env.get('JWT_PRIVATE_KEY')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['HS256'],
      secretOrKey,
    })
  }

  async validate(payload: tokenSchemaType) {
    return tokenSchema.parse(payload)
  }
}
