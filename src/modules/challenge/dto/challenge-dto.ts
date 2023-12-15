import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class NestedJsonDto {
  @ApiProperty({ example: 'nestedValue', description: 'Nested property value' })
  @IsString()
  nestedProperty: string;
}

export class ChallengeDto {
  // @ApiProperty()
  // @IsString()
  // @MinLength(4)
  // @MaxLength(20)
  // email: string;

  // @ApiProperty()
  // @IsString()
  // @MinLength(8)
  // @MaxLength(32)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password is too weak',
  // })
  // password: string;
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  spendTime: number;

  @ApiProperty()
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

  @ApiProperty()
  frameworkId: number;

  @ApiProperty()
  category: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  type: number;
}
