import { PaginationQueryParams, SeriesDto } from "src/modules/series/dto/series-dto";

export interface IQueryParams extends PaginationQueryParams {
 id: string
}

export interface ISeriesRequest extends Omit<SeriesDto, 'listChallenge'> {
 authorId: number
}

export interface ISeriesUpdate extends SeriesDto {
 authorId: number
}

export type PaginationQueryParamsWithoutTab = Pick<PaginationQueryParams, 'limit' | 'page'>

export type SeriesWithoutChallenge = Omit<SeriesDto, 'seriesId' | 'challenges'>
