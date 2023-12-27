import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: Prisma.UserCreateInput): Promise<any> {
    const { password } = data;
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(password, salt);

    try {
      await this.prisma.user.create({ data });
      return { statusCode: '200', message: 'success' };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(data: Prisma.UserCreateInput): Promise<any> {
    try {
      const { email, password } = data;
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          const access_token = await this.handleLogin({
            id: user.id,
            email: user.email,
          });
          return { statusCode: '200', access_token };
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      if (error) {
        throw new HttpException(
          error.message,
          error.code ? error.code : error.status,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async handleLogin(data: any) {
    const { id, email } = data;
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        lastLogin: new Date(),
      },
    });
    const access_token: string = await this.jwtService.signAsync({
      id,
      email,
    });
    return access_token;
  }

  async resetPassword(data: any): Promise<any> {
    try {
      const { email, current, newPassword } = data;
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new NotFoundException();
      }

      const isValid = await bcrypt.compare(current, user.password);
      if (!isValid) {
        throw new UnauthorizedException();
      }

      const salt = await bcrypt.genSalt();

      let password = '';
      password = await bcrypt.hash(newPassword, salt);

      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          password,
        },
      });
      return { statusCode: '200', message: 'Reset password successfully.' };
    } catch (error) {
      throw error;
    }
  }

  async loginSocial(req: Request): Promise<any> {
    try {
      const reqUser: any = req.user;
      const { email, firstName, lastName, picture } = reqUser;
      const nickname = lastName ? firstName + ' ' + lastName : firstName;
      const avatarUrl = picture;
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        const newUser = await this.prisma.user.create({
          data: {
            email,
            nickname,
            avatarUrl,
            password: '',
          },
        });

        const access_token = await this.handleLogin({ id: newUser.id, email });
        return { statusCode: '200', access_token };
      } else {
        const access_token = await this.handleLogin({ id: user.id, email });
        return { statusCode: '200', access_token };
      }
    } catch (error) {
      throw error;
    }
  }
}
