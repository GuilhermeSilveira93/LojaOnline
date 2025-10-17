import { IsString, MinLength } from 'class-validator';

export class ResetSenhaDto {
  @IsString() @MinLength(6) novaSenha: string;
}
