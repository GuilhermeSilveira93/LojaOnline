import { IsEnum } from 'class-validator';
import { LoginDto } from './login.dto';
import { Role } from '@prisma/client';

export class CreateDto extends LoginDto {
  @IsEnum(Role)
  role: Role
}