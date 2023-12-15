import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { SeriesModule } from './modules/series/series.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    AuthModule,
    UserModule,
    ChallengeModule,
    SeriesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
