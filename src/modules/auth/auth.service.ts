import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { PrismaService } from 'src/database/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService
  ) {}

  async signUp(data: Prisma.UserCreateInput): Promise<void> {
    const { username, password } = data
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      await this.prisma.user.create({data});
      return 
    } catch (error) {
      console.log(error)
      return error
    }
  }

}
