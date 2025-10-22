import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnderecoDto } from './endereco.dto';

export class CriarClienteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  documento: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  telefone?: string;
  endereco: EnderecoDto;
}
