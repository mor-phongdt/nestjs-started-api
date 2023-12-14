import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { ChallengeModule } from './modules/challenge/challenge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.local`],
    }),
    AuthModule,
    UserModule,
    ChallengeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
