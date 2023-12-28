import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { WordService } from './word.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewWordsDto } from './dto/word.dto';

@ApiTags('words')
@Controller('api/word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of words is fetched successfully.',
  })
  @Get()
  getWords(): Promise<void> {
    return this.wordService.getWords();
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
