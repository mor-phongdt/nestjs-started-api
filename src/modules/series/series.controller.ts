import { Controller, Get, HttpCode, HttpStatus, Param, Put, Post, Query, Redirect, Request, UseGuards, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SeriesService } from "./series.service";
import { SeriesDto } from "./dto/series-dto";
import { User } from "../users/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { IUser } from "src/types/user/index.type";

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
    @Query('tab') tab: string,
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
    @Query('tab') tab: string,
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
    @Query('tab') tab: string,
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    return this.seriesService.getListChallengeBySeries(seriesId, page, limit)
  }
}