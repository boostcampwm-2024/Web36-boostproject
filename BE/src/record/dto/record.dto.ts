import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export enum Domains {
  NAME = 'name',
  COUNTRY = 'country',
  CITY = 'city',
  EMAIL = 'email',
  PHONE = 'phone',
  SEX = 'sex',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ENUM = 'enum',
}

export class RandomRecordInsertDto {
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RandomColumnInfo)
  columns: RandomColumnInfo[];

  @IsInt()
  @Min(1)
  @Max(100000)
  count: number;
}

export class RandomColumnInfo {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Domains)
  type: Domains;

  @IsInt()
  @Min(0)
  @Max(100)
  blank: number;

  @IsOptional()
  @IsNumber()
  min?: number;

  @IsOptional()
  @IsNumber()
  max?: number;

  @ValidateIf((obj) => obj.enum !== undefined)
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  enum?: string[];
}
