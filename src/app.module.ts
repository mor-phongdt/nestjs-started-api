import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { WordModule } from './modules/words/word.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    AuthModule,
    UserModule,
    ChallengeModule,
    WordModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
