import { CanActivate, ExecutionContext, Injectable, ForbiddenException, SetMetadata } from '@nestjs/common';

export interface PolicyHandler {
  handle(ability: any): boolean | Promise<boolean>;
}

export const CHECK_POLICIES_KEY  = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY , handlers);

@Injectable()
export class PoliciesGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    const handlers: PolicyHandler[] = Reflect.getMetadata(CHECK_POLICIES_KEY , ctx.getHandler()) || [];
    for (const h of handlers) {
      const ok = await h.handle(request.ability ?? {});
      if (!ok) throw new ForbiddenException('ACESSO_NEGADO');
    }
    return true;
  }
}
