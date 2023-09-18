import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [
    ConfigModule,
    PrismaModule
  ],
  providers: [
    AuthService,
    PrismaService
  ],
  controllers: [AuthController],
})
export class AuthModule {}
