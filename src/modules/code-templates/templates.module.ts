import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  providers: [TemplatesService, JwtStrategy],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
