import { ApiProperty } from "@nestjs/swagger";

export class SeriesDto {

 @ApiProperty()
 authorId: number;

 @ApiProperty()
 name: string;

 @ApiProperty()
 description: string;

 @ApiProperty()
 status: number;

 @ApiProperty()
 image_url: string

 @ApiProperty()
 listChallenge: Array<number>

}

export class UpdateSeriesDto {

 @ApiProperty()
 seriesId: number;

 @ApiProperty()
 challenges: Array<number>

}



