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

export class SubmissionChallengeDto {
  @IsObject()
  @ValidateNested()
  @ApiProperty()
  code: NestedJsonDto;

  //0: not completed,1:draft, 999: completed
  @ApiProperty({
    example: '1',
    description: '0: not completed,1:draft, 999: completed',
  })
  status: number;
}
