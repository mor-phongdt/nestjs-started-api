import { Controller, Get, HttpCode, HttpStatus, Param, Put, Post, Query, Request, UseGuards, Body, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SeriesService } from "./series.service";
import { SeriesDto, StudySeriesChallengeDto } from "./dto/series-dto";
import { User } from "../users/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { IUser } from "src/types/user/index.type";
import { ChallengeCategory } from "@prisma/client";
import { ISeriesRequest, ISeriesUpdate } from "src/types/series/index.type";

@ApiTags('series')
@Controller('api/series')
@ApiBearerAuth()
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) { }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/create')
  createSeries(
    @Body() seriesDto: SeriesDto,
    @User() user: IUser,
  ) {
    return this.seriesService.createSeries({
      authorId: user.id,
      name: seriesDto.name,
      description: seriesDto.description,
      status: seriesDto.status,
      image_url: seriesDto.image_url
    }, seriesDto.listChallenge)
  }

  // @UseGuards(JwtAuthGuard)
  // @HttpCode(HttpStatus.OK)
  // @Put('/update/:id')
  // updateSeries(
  //   @Param('id') id: string,
  //   @Body() series: ISeriesUpdate,
  //   @User() user: IUser
  // ) {
  //   return this.seriesService.updateSeries(series, user, id)
  // }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  deleteSeries(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.seriesService.deleteSeries(id, user)
  }

  @HttpCode(HttpStatus.OK)
  @Get('/list?')
  getAllSeries(
    @Query('limit') limit: string,
    @Query('page') page: string
  ) {
    return this.seriesService.getAllSeries({ limit, page })
  }

}