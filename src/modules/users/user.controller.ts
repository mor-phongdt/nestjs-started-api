import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from 'src/modules/users/user.service';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('/test')
  // test() {
  //   return 'abc';
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('/signup')
  // @ApiBody({ type: AuthCredentialsDto })
  // signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
  //   return this.authService.signUp(authCredentialsDto);
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('/login')
  // @ApiBody({ type: AuthCredentialsDto })
  // signIn(
  //   @Body() authCredentialsDto: AuthCredentialsDto,
  // ): Promise<{ accessToken: string }> {
  //   return this.authService.signIn(authCredentialsDto);
  // }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getDetailUser(@Param('id') id: number): Promise<any> {
    return this.userService.getUserById(Number(id));
  }
}
