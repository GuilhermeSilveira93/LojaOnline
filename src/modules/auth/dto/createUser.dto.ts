import { IsEnum } from 'class-validator';
import { LoginDto } from './login.dto';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDto extends LoginDto {
  @IsEnum(Role)
  @ApiProperty({ name: 'role', enum: Role })
  role: Role;
}
