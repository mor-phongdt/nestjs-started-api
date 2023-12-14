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

  async getListChallenge(): Promise<{ data: any[] }> {
    try {
      const listChallenge = await this.prisma.challenge.findMany();
      if (listChallenge) return { data: listChallenge };
    } catch (error) {
      throw error;
    }
  }

  async getDetailChallenge(id: number): Promise<{ data: any }> {
    try {
      const challenge = await this.prisma.challenge.findUnique({
        where: {
          id,
        },
      });
      if (challenge) return { data: challenge };
      else throw new NotFoundException('Challenge not found');
    } catch (error) {
      throw error;
    }
  }
}
