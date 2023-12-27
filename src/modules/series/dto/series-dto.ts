import { ApiProperty } from "@nestjs/swagger";
import { ChallengeCategory } from "@prisma/client";
import { IsOptional, IsString } from "class-validator";

export class SeriesDto {

 @ApiProperty()
 name: string;

 @IsOptional()
 @ApiProperty()
 description: string;

 @ApiProperty()
 status: number;

 @IsOptional()
 @ApiProperty()
 image_url: string

 @IsOptional()
 @ApiProperty()
 listChallenge: Array<number>

}

export class StudySeriesChallengeDto extends SeriesDto {

 @ApiProperty()
 seriesId: number;

}

export class PaginationQueryParams {

 @IsOptional()
 @IsString()
 tab?: ChallengeCategory;

 @IsOptional()
 @IsString()
 limit?: string;

 @IsOptional()
 @IsString()
 page?: string;
}
