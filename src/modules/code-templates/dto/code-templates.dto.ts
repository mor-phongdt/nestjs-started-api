import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

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

  @ApiProperty()
  @IsNumber()
  challengeId: string;

  @ApiProperty()
  @IsNumber()
  frameworkId: string;
}
