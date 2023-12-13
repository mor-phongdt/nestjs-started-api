import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/test')
  test() {
    return 'abc';
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  @ApiBody({ type: AuthCredentialsDto })
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiBody({ type: AuthCredentialsDto })
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
