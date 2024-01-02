import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { WordService } from './word.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewWordsDto } from './dto/word.dto';

@ApiTags('words')
@Controller('api/word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @ApiQuery({
    name: 'q',
    type: String,
    description: 'A parameter. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: String,
    description: 'A parameter. Optional',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    description: 'A parameter. Optional',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of words is fetched successfully.',
  })
  @Get('/?')
  getWords(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<void> {
    return this.wordService.getWords(q, page, limit);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A word is fetched successfully',
  })
  @Post('/create')
  createNewWord(@Body() newWordsDto: NewWordsDto) {
    return this.wordService.createNewWord({
      ...newWordsDto,
      definition: JSON.stringify(newWordsDto.definition),
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A word is fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found.',
  })
  @Delete(':id')
  deleteWord(@Param('id') id: number): Promise<any> {
    return this.wordService.deleteWord(id);
  }
}
