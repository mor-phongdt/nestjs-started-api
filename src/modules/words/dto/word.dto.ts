import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class DefinitionJsonDto {
  @ApiProperty({
    example: 'typeValue',
    description: 'Type property value',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 'meaningValue',
    description: 'Meaning property value',
  })
  @IsString()
  meaning: string;
}
export class NewWordsDto {
  @ApiProperty()
  @IsString()
  word: string;

  @ApiProperty()
  @IsNotEmpty()
  definition: DefinitionJsonDto;

  @ApiProperty()
  @IsString()
  example: string;
}
