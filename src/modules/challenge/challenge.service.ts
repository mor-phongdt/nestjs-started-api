import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { excludeField } from 'src/utils';

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
      const listChallenge = await this.prisma.challenge.findMany({
        include: {
          author: {
            select: {
              id: true,
              email: true,
              nickname: true,
              avatarUrl: true,
              theme_ide: true,
              position: true,
            },
          },
          challengeLanguage: {
            select: {
              framework: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });

      if (listChallenge)
        return {
          data: listChallenge.map((challenge: any) => {
            challenge.frameworks = [
              ...challenge.challengeLanguage.map((item: any) => {
                return { ...item.framework };
              }),
            ];
            return excludeField(challenge, ['authorId', 'challengeLanguage']);
          }),
        };
    } catch (error) {
      throw error;
    }
  }

  async getDetailChallenge(id: number): Promise<{ data: any }> {
    try {
      const challenge: any = await this.prisma.challenge.findUnique({
        where: {
          id,
        },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              nickname: true,
              avatarUrl: true,
              theme_ide: true,
              position: true,
            },
          },
          challengeLanguage: {
            select: {
              framework: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
      if (challenge) {
        challenge.frameworks = [
          ...challenge.challengeLanguage.map((item: any) => {
            return { ...item.framework };
          }),
        ];
        return {
          data: excludeField(challenge, ['authorId', 'challengeLanguage']),
        };
      } else throw new NotFoundException('Challenge not found');
    } catch (error) {
      throw error;
    }
  }

  async startChallenge(
    challengeId: number,
    userId: number,
  ): Promise<{ message: string }> {
    try {
      const result = await this.prisma.submissionChallenge.create({
        data: {
          challengeId,
          userId,
          status: 0,
          startTime: new Date().toISOString(),
        },
      });
      if (result) return { message: 'success' };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Challenge already started');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async saveResultChallenge(
    challengeId: number,
    userId: number,
    data: any,
  ): Promise<{ message: string }> {
    try {
      const hasRecord = await this.prisma.submissionChallenge.findUnique({
        where: {
          challengeId_userId: {
            challengeId,
            userId,
          },
        },
      });
      if (hasRecord) {
        const result = await this.prisma.submissionChallenge.update({
          where: {
            challengeId_userId: {
              challengeId,
              userId,
            },
          },
          data,
        });
        if (result) return { message: 'success' };
      }
    } catch (error) {
      throw error;
    }
  }

  async getSubmissionChallenge(
    challengeId: number,
    userId: number,
  ): Promise<{ data: any }> {
    try {
      const submissionChallenge =
        await this.prisma.submissionChallenge.findUnique({
          where: {
            challengeId_userId: {
              challengeId,
              userId,
            },
          },
        });
      console.log(submissionChallenge);
      if (submissionChallenge) return { data: submissionChallenge };
      else throw new NotFoundException('Challenge not start');
    } catch (error) {
      throw error;
    }
  }
}
