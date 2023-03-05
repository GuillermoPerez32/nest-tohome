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
import { Genders } from '../interfaces/genders.interface';

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
  @IsIn(Object.values(Genders))
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
