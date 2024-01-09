import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CodeTemplateDto } from './dto/code-templates.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiBearerAuth()
@ApiTags('templates')
@Controller('api/templates')
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'challengeId',
    required: false,
  })
  @ApiQuery({
    name: 'frameworkId',
    required: false,
  })
  @Get('list')
  getListTemplates(
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('challengeId', ParseIntPipe) challengeId?: number,
    @Query('frameworkId', ParseIntPipe) frameworkId?: number,
  ) {
    return this.templateService.getListTemplates(
      limit,
      page,
      challengeId,
      frameworkId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @Get(':id')
  getDetailTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.getDetailTemplate(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @Get(':challengeId/:frameworkId')
  getTemplateByChallengeLanguage(
    @Param('challengeId', ParseIntPipe) challengeId: number,
    @Param('frameworkId', ParseIntPipe) frameworkId: number,
  ) {
    return this.templateService.findTemplateByChallengeLanguage(
      challengeId,
      frameworkId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @Post('create')
  createTemplate(@Body() body: CodeTemplateDto) {
    return this.templateService.createTemplate({
      ...body,
      template: JSON.stringify(body.template),
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @Patch(':id')
  updateTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CodeTemplateDto,
  ) {
    return this.templateService.updateTemplate(id, {
      ...body,
      template: JSON.stringify(body.template),
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @Delete(':id')
  deleteTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.templateService.deleteTemplate(id);
  }
}
