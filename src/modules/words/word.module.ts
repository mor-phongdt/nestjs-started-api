import { Module } from '@nestjs/common';
import { WordController } from 'src/modules/words/word.controller';
import { WordService } from 'src/modules/words/word.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [WordService, JwtService, JwtStrategy],
  controllers: [WordController],
})
export class WordModule {}
