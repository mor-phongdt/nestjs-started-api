import { PaginationQueryParams, SeriesDto } from "src/modules/series/dto/series-dto";

export interface IQueryParams extends PaginationQueryParams {
 id: string
}

export interface ISeriesCreateRequest extends Omit<SeriesDto, 'listChallenge'> {
 authorId: number
}

export type PaginationQueryParamsWithoutTab = Pick<PaginationQueryParams, 'limit' | 'page'>

export type SeriesWithoutChallenge = Omit<SeriesDto, 'seriesId' | 'challenges'>
