import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class ItemDto {
  @ApiProperty()
  @IsString()
  produtoId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantidade: number;
}

export class IncludeProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  userId: string;

  @ApiProperty({ type: () => ItemDto })
  @ValidateNested()
  @Type(() => ItemDto)
  item: ItemDto;
}
