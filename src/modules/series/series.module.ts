import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/database/prisma.module";
import { SeriesService } from "./series.service";
import { PrismaService } from "src/database/prisma.service";
import { APP_GUARD } from "@nestjs/core";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";
import { SeriesController } from "./series.controller";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600
        }
      })
    })
  ],
  providers: [
    SeriesService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtStrategy
    }
  ],
  controllers: [SeriesController]
})
export class SeriesModule { }