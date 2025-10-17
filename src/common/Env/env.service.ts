import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvType } from './zod/env'


@Injectable()
export class EnvService {
  constructor(private config: ConfigService<EnvType, true>) {}
  get<T extends keyof EnvType>(key: T) {
    return this.config.get(key, { infer: true })
  }
}
