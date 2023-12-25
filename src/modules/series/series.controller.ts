import { Controller, Get, HttpCode, HttpStatus, Param, Put, Post, Query, Redirect, Request, UseGuards, Body, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SeriesService } from "./series.service";
import { SeriesDto, UpdateSeriesDto } from "./dto/series-dto";
import { User } from "../users/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { IUser } from "src/types/user/index.type";
import { ChallengeCategory } from "@prisma/client";

@ApiTags('series')
@Controller('api/series')
@ApiBearerAuth()
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) { }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SUCCESSFULLY!'
  })
  @Get('/list?')
  getListCategoryChallenge(
    @Query('tab') tab: ChallengeCategory,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('series_id') seriesId: string,
  ) {
    return this.seriesService.getListChallengeByCategory(tab, page, limit, seriesId)
  }


  @HttpCode(HttpStatus.OK)
  @Get('framework')
  getListFrameWork(@User() user: IUser) {
    console.log(user.id)
    return this.seriesService.getListFrameWork()
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SUCCESSFULLY!'
  })
  @Get('/framework?')
  getListChallengeByFrameWork(
    @Query('id') id: string,
    @Query('tab') tab: ChallengeCategory,
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    return this.seriesService.getListChallengeByFrameWork(id, tab, page, limit)
  }

  @HttpCode(HttpStatus.OK)
  @Put('/')
  updateSeriesChallenge(@Request() req: Request) {
    return this.seriesService.updateSeriesChallenge(req)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/series/create')
  createSeries(
    @Body() seriesDto: SeriesDto,
    @User() user: IUser,
  ) {
    return this.seriesService.createSeries(seriesDto, user)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('series/update')
  updateSeries(@Body() series: UpdateSeriesDto) {
    return this.seriesService.updateSeries(series)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/series/:id')
  deleteService(@Param('id') id: string, @User() user: IUser) {
    return this.seriesService.deleteSeries(id, user)
  }

  @HttpCode(HttpStatus.OK)
  @Get('/series/list?')
  getAllSeries(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    return this.seriesService.getAllSeries(page, limit)
  }

  @HttpCode(HttpStatus.OK)
  @Get('/series/detail?')
  getListChallengeBySeries(
    @Query('id') seriesId: string,
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    return this.seriesService.getListChallengeBySeries(seriesId, page, limit)
  }
}