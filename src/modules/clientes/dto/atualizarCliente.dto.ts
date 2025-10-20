import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnderecoDto } from './endereco.dto';

export class AtualizarClienteDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  nome?: string;
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  documento?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  telefone?: string;
  @ApiProperty()
  @IsOptional()
  endereco?: EnderecoDto;
}
