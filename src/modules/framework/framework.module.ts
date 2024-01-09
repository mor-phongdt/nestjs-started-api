import { Module } from '@nestjs/common';
import { FrameworkService } from './framework.service';
import { FrameworkController } from './framework.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  providers: [FrameworkService, JwtStrategy],
  controllers: [FrameworkController],
})
export class FrameworkModule {}
