import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FrameworkDto {
  @ApiProperty()
  @IsString()
  name: string;
}
