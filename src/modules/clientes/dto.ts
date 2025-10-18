import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnderecoDto {
  @ApiProperty()
  @IsString() rua: string;
  @ApiProperty()
  @IsString() numero: string;
  @ApiProperty()
  @IsString() @IsOptional() complemento?: string;
  @ApiProperty()
  @IsString() bairro: string;
  @ApiProperty()
  @IsString() cidade: string;
  @ApiProperty()
  @IsString() uf: string;
  @ApiProperty()
  @IsString() cep: string;
}

export class CriarClienteDto {
  @ApiProperty()
  @IsString() @IsNotEmpty() nome: string;
  @ApiProperty()
  @ApiProperty()
  @ApiProperty()
  @IsEmail() email: string;
  @ApiProperty()
  @ApiProperty()
  @IsString() documento: string;
  @ApiProperty()
  @IsString() @IsOptional() telefone?: string;
  endereco: EnderecoDto;
}

export class AtualizarClienteDto {
  @ApiProperty()
  @IsString() @IsOptional() nome?: string;
  @ApiProperty()
  @IsEmail() @IsOptional() email?: string;
  @ApiProperty()
  @IsString() @IsOptional() documento?: string;
  @ApiProperty()
  @IsString() @IsOptional() telefone?: string;
  @ApiProperty()
  @IsOptional() endereco?: EnderecoDto;
}
