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
import { ApiProperty } from '@nestjs/swagger';
export class CriarProdutoDto {
  @ApiProperty()
  @IsString() @IsNotEmpty() nome: string;
  @ApiProperty()
  @IsString() @IsOptional() descricao?: string;
  @ApiProperty()
  @IsNumber() precoBase: number;
  @ApiProperty()
  @IsInt() @Min(0) estoque: number;
  @ApiProperty()
  @IsBoolean() @IsOptional() ativo?: boolean = true;
}