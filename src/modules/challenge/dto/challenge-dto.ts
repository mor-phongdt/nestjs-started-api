import {
  IsString,
  Matches,
  MaxLength,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class NestedJsonDto {
  @ApiProperty({ example: 'nestedValue', description: 'Nested property value' })
  @IsString()
  nestedProperty: string;
}

export enum ChallengeTypeEnum {
  preview = 'preview',
  console = 'console',
}

export enum ChallengeCategoryEnum {
  coding = 'coding',
  system_design = 'system_design',
}

export class ChallengeDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  spendTime: number;

  @ApiProperty({ example: 1, description: 'from 1 to 3' })
  level: number;

  @IsObject()
  @ValidateNested()
  @ApiProperty()
  codeTemplate: NestedJsonDto;

  @IsObject()
  @ValidateNested()
  @ApiProperty()
  codeSolution: NestedJsonDto;

  @IsObject()
  @ValidateNested()
  @ApiProperty()
  codeTest: NestedJsonDto;

  @ApiProperty({ example: 1, description: 'from 1 to 5' })
  frameworkId: number;

  @IsEnum(ChallengeCategoryEnum, { message: 'Invalid value' })
  @ApiProperty({ example: 'coding', description: 'coding or system_design' })
  category: ChallengeCategoryEnum;

  @ApiProperty()
  status: number;

  @IsEnum(ChallengeTypeEnum, { message: 'Invalid value' })
  @ApiProperty({ example: 'preview', description: 'preview or console' })
  type: ChallengeTypeEnum;
}
