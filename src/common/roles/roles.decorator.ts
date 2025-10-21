import { SetMetadata } from '@nestjs/common';
export enum Role {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
}
export const ROLES_KEY = 'ROLES_KEY';
export const IS_PUBLIC_KEY = 'isPublic';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
