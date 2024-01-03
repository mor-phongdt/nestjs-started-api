import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FrameworkService } from './framework.service';
import { FrameworkDto } from './dto/framework.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('framework')
@Controller('api/framework')
@ApiBearerAuth()
export class FrameworkController {
  constructor(private readonly frameworkService: FrameworkService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A list of frameworks is fetched successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @Get('list')
  getListFrameworks() {
    return this.frameworkService.getListFrameworks();
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
  getDetailFramework(@Param('id') id: number) {
    return this.frameworkService.getDetailFramework(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Existed.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @Post('create')
  createFramework(@Body() body: FrameworkDto) {
    return this.frameworkService.createFramework(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated',
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
  updateFramework(@Param('id') id: number, @Body() body: FrameworkDto) {
    return this.frameworkService.updateFramework(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleted.',
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
  deleteFramework(@Param('id') id: number) {
    return this.frameworkService.deleteFramework(id);
  }
}
