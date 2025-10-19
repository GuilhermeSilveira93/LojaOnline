import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarProdutoDto {
  @ApiProperty()
  @IsString() @IsOptional() nome?: string;
  @ApiProperty()
  @IsString() @IsOptional() descricao?: string;
  @ApiProperty()
  @IsNumber() @IsOptional() precoBase?: number;
  @ApiProperty()
  @IsInt() @Min(0) @IsOptional() estoque?: number;
  @ApiProperty()
  @IsBoolean() @IsOptional() ativo?: boolean;
}

