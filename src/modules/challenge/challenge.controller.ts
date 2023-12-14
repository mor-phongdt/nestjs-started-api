import {
  Param,
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChallengeService } from 'src/modules/challenge/challenge.service';
import { ChallengeDto } from './dto/challenge-dto';

@ApiTags('challenge')
@Controller('api/challenge')
@ApiBearerAuth()
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  getListChallenge() {
    return this.challengeService.getListChallenge();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getDetailUser(@Param('id') id: number): Promise<any> {
    return this.challengeService.getDetailChallenge(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/create-challenge')
  @ApiBody({ type: ChallengeDto })
  createChallenge(
    @Request() req: Record<string, any>,
    @Body() challengeDto: ChallengeDto,
  ): Promise<{ message: string }> {
    return this.challengeService.createChallenge({
      ...challengeDto,
      codeTemplate: JSON.stringify(challengeDto.codeTemplate),
      codeSolution: JSON.stringify(challengeDto.codeSolution),
      codeTest: JSON.stringify(challengeDto.codeTest),
      authorId: req.user.id,
    });
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('/login')
  // @ApiBody({ type: AuthCredentialsDto })
  // signIn(
  //   @Body() authCredentialsDto: AuthCredentialsDto,
  // ): Promise<{ accessToken: string }> {
  //   return this.authService.signIn(authCredentialsDto);
  // }
}
