import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';
import { UserController } from 'src/modules/users/user.controller';
import { UserService } from 'src/modules/users/user.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  providers: [
    UserService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
