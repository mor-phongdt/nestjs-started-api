import { Module } from '@nestjs/common';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { customUsersRepository } from './users.repository';
import { User } from './users.entity';

@Module({
  imports: [
    ConfigModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get('JWT_SECRET'),
    //     signOptions: {
    //       expiresIn: 3600,
    //     },
    //   }),
    // }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        // Override default repository for Task with a custom one
        return dataSource.getRepository(User).extend(customUsersRepository);
      },
    },
  ],
  controllers: [AuthController],
  // exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
