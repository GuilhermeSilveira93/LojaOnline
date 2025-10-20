import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnderecoDto {
  @ApiProperty()
  @IsString()
  rua: string;
  @ApiProperty()
  @IsString()
  numero: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  complemento?: string;
  @ApiProperty()
  @IsString()
  bairro: string;
  @ApiProperty()
  @IsString()
  cidade: string;
  @ApiProperty()
  @IsString()
  uf: string;
  @ApiProperty()
  @IsString()
  cep: string;
}
