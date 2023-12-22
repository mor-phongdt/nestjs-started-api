import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NewWordsDto {
  @ApiProperty()
  @IsString()
  word: string;

  @ApiProperty()
  @IsString()
  mean: string;

  @ApiProperty()
  @IsString()
  example: string;
}
