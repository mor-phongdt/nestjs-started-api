import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  serializeUser(user: any, done: any) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    return user ? done(null, user) : done(null, null);
  }
}
