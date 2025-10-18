import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EnderecoDto {
  @IsString() rua: string;
  @IsString() numero: string;
  @IsString() @IsOptional() complemento?: string;
  @IsString() bairro: string;
  @IsString() cidade: string;
  @IsString() uf: string;
  @IsString() cep: string;
}

export class CriarClienteDto {
  @IsString() @IsNotEmpty() nome: string;
  @IsEmail() email: string;
  @IsString() documento: string;
  @IsString() @IsOptional() telefone?: string;
  endereco: EnderecoDto;
}

export class AtualizarClienteDto {
  @IsString() @IsOptional() nome?: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() documento?: string;
  @IsString() @IsOptional() telefone?: string;
  @IsOptional() endereco?: EnderecoDto;
}
