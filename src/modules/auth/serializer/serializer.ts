import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  serializeUser(user: any, done: (err?: Error | null, profile?: any) => void) {
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (err?: Error | null, profile?: any) => void,
  ) {
    const query: any = {};
    if (payload.id) {
      query.id = payload.id;
    } else {
      query.email = payload.email;
    }
    const user = await this.prisma.user.findUnique({
      where: query,
    });
    return user ? done(null, user) : done(null, null);
  }
}
