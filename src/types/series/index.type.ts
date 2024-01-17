import { PaginationQueryParams, SeriesDto } from "src/modules/series/dto/series-dto";

export interface IQueryParams extends PaginationQueryParams {
 id: string
}

export interface ISeriesRequest extends Omit<SeriesDto, 'listChallenge'> {
 authorId: string
}

export interface ISeriesUpdate extends SeriesDto {
 id: string
 authorId: string
}

export type PaginationQueryParamsWithoutTab = Pick<PaginationQueryParams, 'limit' | 'page'>

export type SeriesWithoutChallenge = Omit<SeriesDto, 'seriesId' | 'challenges'>
