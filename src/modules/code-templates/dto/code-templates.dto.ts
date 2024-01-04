import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class NestedJsonDto {
  @ApiProperty({ example: 'nestedValue', description: 'Nested property value' })
  @IsString()
  nestedProperty: string;
}

export class CodeTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  description: string;

  @IsObject()
  @ValidateNested()
  @ApiProperty()
  template: NestedJsonDto;
}

export class PaginationQueryParams {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;
}
