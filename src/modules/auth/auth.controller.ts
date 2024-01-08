import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
  Headers,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOAuth2,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GoogleAuthGuard } from './guards/google.guard';
import { Request, Response } from 'express';
import { GithubAuthGuard } from './guards/github.guard';
@ApiTags('auth')
@Controller('api/auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  @ApiBody({ type: AuthCredentialsDto })
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @Post('/login')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset password successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invalid credentials.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/reset')
  resetPassword(@Body() data: any) {
    return this.authService.resetPassword(data);
  }

  @ApiOAuth2(['profile', 'email'])
  @UseGuards(GoogleAuthGuard)
  @Get('/login/google')
  signInGoogle() {
    return { message: 'logged in using google' };
  }

  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  @Get('/google/redirect')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { access_token } = await this.authService.loginSocial(req);
    res.redirect(
      `${process.env.FE_URL}/oauth-success-redirect/${access_token}`,
    );
  }

  @ApiOAuth2(['profile', 'email'])
  @UseGuards(GithubAuthGuard)
  @Get('/login/github')
  signInGithub() {
    return { message: 'logged in using github' };
  }

  @ApiExcludeEndpoint()
  @UseGuards(GithubAuthGuard)
  @Get('/github/callback')
  async githubCallback(@Req() req: Request, @Res() res: Response, @Headers('referer') referer?: string) {
    const { access_token } = await this.authService.loginSocial(req);
    res.redirect(
      `${referer}/oauth-success-redirect/${access_token}`,
    );
  }
}
