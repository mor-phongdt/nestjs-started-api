import {
  Param,
  Body,
  Controller,
  Get,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChallengeService } from 'src/modules/challenge/challenge.service';
import { ChallengeDto } from './dto/challenge-dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SubmissionChallengeDto } from './dto/submission-challenge-dto';

@ApiTags('challenge')
@Controller('api/challenge')
@ApiBearerAuth()
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getListChallenge() {
    return this.challengeService.getListChallenge();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getDetailUser(@Param('id') id: number): Promise<any> {
    return this.challengeService.getDetailChallenge(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/create')
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
      authorId: Number(req.user.id),
    });
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/start')
  startChallenge(
    @Param('id') challengeId: number,
    @Request() req: Record<string, any>,
  ): Promise<{ message: string }> {
    return this.challengeService.startChallenge(
      Number(challengeId),
      Number(req.user.id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id/submission')
  @ApiBody({ type: SubmissionChallengeDto })
  saveResultChallenge(
    @Param('id') challengeId: number,
    @Request() req: Record<string, any>,
    @Body() submitChallengeDto: SubmissionChallengeDto,
  ): Promise<{ message: string }> {
    return this.challengeService.saveResultChallenge(
      Number(challengeId),
      Number(req.user.id),
      {
        ...submitChallengeDto,
        code: JSON.stringify(submitChallengeDto.code),
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id/submission')
  getSubmissionChallenge(
    @Param('id') challengeId: number,
    @Request() req: Record<string, any>,
  ): Promise<{ data: any }> {
    return this.challengeService.getSubmissionChallenge(
      Number(challengeId),
      Number(req.user.id),
    );
  }
}
