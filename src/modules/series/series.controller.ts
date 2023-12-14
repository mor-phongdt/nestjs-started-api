import { Controller, Get, HttpCode, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SeriesService } from "./series.service";

@ApiTags('series')
@Controller('api/series')
@ApiBearerAuth()
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) { }

  @HttpCode(HttpStatus.OK)
  @Get('/list?')
  getListSeriesChallenge(
    @Query('tab') tab: string,
    @Query('page') page: string
  ) {
    return this.seriesService.getListSeriesChallenge(tab, page)
  }
}