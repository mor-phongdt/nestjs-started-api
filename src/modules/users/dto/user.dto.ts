import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UsersDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  nickname: string;
}
//   @ApiProperty({ type: 'string', format: 'binary', required: false })
//   file: Express.Multer.File;
