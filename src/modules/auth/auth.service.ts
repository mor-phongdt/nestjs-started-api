import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
      return { message: 'success' };
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
          const access_token: string = await this.jwtService.signAsync({
            id: user.id,
            email: user.email,
          });
          return { access_token };
        } else throw new UnauthorizedException();
      }
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async getUser(): Promise<any> {}

  async updateUser(): Promise<any> {}

  async deleteUser(): Promise<any> {}
}
