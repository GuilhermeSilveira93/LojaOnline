import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CriarProdutoDto {
  @IsString() @IsNotEmpty() nome: string;
  @IsString() @IsOptional() descricao?: string;
  @IsNumber() precoBase: number;
  @IsInt() @Min(0) estoque: number;
  @IsBoolean() @IsOptional() ativo?: boolean = true;
}

export class AtualizarProdutoDto {
  @IsString() @IsOptional() nome?: string;
  @IsString() @IsOptional() descricao?: string;
  @IsNumber() @IsOptional() precoBase?: number;
  @IsInt() @Min(0) @IsOptional() estoque?: number;
  @IsBoolean() @IsOptional() ativo?: boolean;
}

export class AplicarDescontoDto {
  @IsInt() @Min(0) @Max(100) descontoPercentual: number;
}
