import { Module } from '@nestjs/common';
import { ChallengeController } from 'src/modules/challenge/challenge.controller';
import { ChallengeService } from 'src/modules/challenge/challenge.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  providers: [ChallengeService, JwtStrategy],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
