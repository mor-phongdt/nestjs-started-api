import { JwtService } from '@nestjs/jwt';
import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@ApiTags('users')
@Controller('api/user')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users is fetched successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Get()
  getUsers(): Promise<void> {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile is fetched',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Get('/profile')
  getUserProfile(@Req() req: Request): Promise<any> {
    const jwt = req.headers.authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt, { json: true }) as { id: number };
    return this.userService.getUserById(json.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A user is fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @Get(':id')
  getUserById(@Param('id') id: number): Promise<any> {
    return this.userService.getUserById(id);
  }

  // @ApiBearerAuth()
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'A user is updated successfully',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'Unauthorized.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Not Found.',
  // })
  // @ApiConsumes('multipart/form-data')
  // @Patch(':id')
  // @UseInterceptors(FileInterceptor('file'))
  // updateUser(
  //   @Param('id') id: number,
  //   @Body() data: UsersDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<any> {
  //   return this.UserService.updateUser(id, data, file);
  // }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A user is fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found.',
  })
  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
