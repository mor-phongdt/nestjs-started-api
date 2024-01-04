import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
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
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('challengeId') challengeId?: number,
    @Query('frameworkId') frameworkId?: number,
  ) {
    return this.templateService.getListTemplates(
      Number(limit),
      Number(page),
      Number(challengeId),
      Number(frameworkId),
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
  getDetailTemplate(@Param('id') id: number) {
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
    @Param('challengeId') challengeId: number,
    @Param('frameworkId') frameworkId: number,
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
  updateTemplate(@Param('id') id: number, @Body() body: CodeTemplateDto) {
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
  deleteTemplate(@Param('id') id: number) {
    return this.templateService.deleteTemplate(id);
  }
}
