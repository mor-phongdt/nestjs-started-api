import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChallengeService {
  constructor(private prisma: PrismaService) {}

  async createChallenge(
    data: Prisma.ChallengeUncheckedCreateInput,
  ): Promise<{ message: string }> {
    try {
      const upsertChallenge = await this.prisma.challenge.create({
        data,
      });
      if (upsertChallenge) return { message: 'success' };
    } catch (error) {
      throw error;
    }
  }

  async getListChallenge(): Promise<any> {
    const users = await this.prisma.challenge.findMany();
    if (users) return { data: users };
  }
}
