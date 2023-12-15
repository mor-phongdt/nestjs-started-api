import { Module } from '@nestjs/common';
import { UserController } from 'src/modules/users/user.controller';
import { UserService } from 'src/modules/users/user.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService, JwtService, JwtStrategy],
  controllers: [UserController],
})
export class UserModule {}
