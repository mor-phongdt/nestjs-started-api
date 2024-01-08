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
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChallengeService } from 'src/modules/challenge/challenge.service';
import { ChallengeDto } from './dto/challenge-dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  SubmissionChallengeDto,
  ReviewChallengeDto,
} from './dto/submission-challenge-dto';

@ApiTags('challenge')
@Controller('api/challenge')
@ApiBearerAuth()
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getListChallengeApi() {
    return this.challengeService.getListChallenge();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getDetailUserApi(@Param('id') id: number): Promise<any> {
    return this.challengeService.getDetailChallenge(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/')
  @ApiBody({ type: ChallengeDto })
  createChallengeApi(
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
  startChallengeApi(
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
  saveResultChallengeApi(
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
  getSubmissionChallengeApi(
    @Param('id', ParseIntPipe) challengeId: number,
    @Request() req: Record<string, any>,
  ): Promise<{ data: any }> {
    return this.challengeService.getSubmissionChallenge(
      challengeId,
      Number(req.user.id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ReviewChallengeDto })
  @Post(':id/submission/:submissionId/review')
  createReviewChallengeApi(
    @Param('id', ParseIntPipe) id: number,
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Request() req: Record<string, any>,
    @Body() reviewChallengeDto: ReviewChallengeDto,
  ): Promise<{ message: string }> {
    return this.challengeService.createReviewSubmission(
      submissionId,
      Number(req.user.id),
      reviewChallengeDto.content,
      reviewChallengeDto.parentCommentId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ReviewChallengeDto })
  @Put(':id/submission/:submissionId/review/:reviewId')
  updateReviewChallengeApi(
    @Param('id', ParseIntPipe) id: number,
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Request() req: Record<string, any>,
    @Body() reviewChallengeDto: ReviewChallengeDto,
  ): Promise<{ message: string }> {
    return this.challengeService.updateReviewSubmission(
      reviewId,
      Number(req.user.id),
      reviewChallengeDto.content,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id/submission/:submissionId/review/:reviewId')
  deleteReviewReviewApi(
    @Param('id', ParseIntPipe) id: number,
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Request() req: Record<string, any>,
  ): Promise<{ message: string }> {
    //TODO: only author can update or delete comment
    return this.challengeService.deleteReviewChallenge(
      reviewId,
      Number(req.user.id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id/submission/:submissionId/conversation')
  getListCommentReviewApi(
    @Param('id', ParseIntPipe) id: number,
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ): Promise<{ data: any }> {
    return this.challengeService.getListCommentChallenge(submissionId);
  }
}
