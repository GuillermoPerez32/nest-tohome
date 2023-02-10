import {
  IsString,
  IsNumber,
  IsPositive,
  MinLength,
  IsInt,
  IsOptional,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
