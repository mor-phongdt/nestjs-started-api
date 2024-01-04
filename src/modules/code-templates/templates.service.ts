import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async getListTemplates(
    limit?: number,
    page?: number,
    challengeId?: number,
    frameworkId?: number,
  ) {
    try {
      const LIMIT = 15;
      const data = await this.prisma.challengeLanguage.findMany({
        ...(limit && page && { take: limit ? limit : LIMIT }),
        ...(limit &&
          page && { skip: limit ? limit * (page - 1) : LIMIT * (page - 1) }),
        where: {
          ...(challengeId && { challengeId }),
          ...(frameworkId && { frameworkId }),
        },
      });

      const totalRecord = await this.prisma.challengeLanguage.count();

      return {
        statusCode: 200,
        data: {
          data: data,
          meta: {
            ...(page && { page }),
            limit: limit ? limit : LIMIT,
            totalPages: totalRecord ? Math.ceil(totalRecord / limit) : 0,
          },
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async getDetailTemplate(id: number) {
    try {
      const data = await this.prisma.challengeLanguage.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!data) {
        throw new NotFoundException();
      }

      return { data: data };
    } catch (err) {
      throw err;
    }
  }

  async createTemplate(data: Prisma.ChallengeLanguageUncheckedCreateInput) {
    try {
      const template = await this.prisma.challengeLanguage.create({
        data,
      });
      if (template) {
        return { message: 'success' };
      }
    } catch (err) {
      throw err;
    }
  }

  async updateTemplate(id: number, data: any) {
    try {
      const template = await this.prisma.challengeLanguage.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!template) {
        throw new NotFoundException();
      }

      const update = await this.prisma.challengeLanguage.update({
        where: {
          id: Number(id),
        },
        data,
      });

      if (update) {
        return { message: 'success' };
      }
    } catch (err) {
      throw err;
    }
  }

  async deleteTemplate(id: number) {
    try {
      const template = await this.prisma.challengeLanguage.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!template) {
        throw new NotFoundException();
      }

      const data = await this.prisma.challengeLanguage.delete({
        where: {
          id: Number(id),
        },
      });

      if (data) {
        return { message: 'deleted' };
      }
    } catch (err) {
      throw err;
    }
  }

  async findTemplateByChallengeLanguage(
    challengeId: number,
    frameworkId: number,
  ) {
    try {
      const template = await this.prisma.challengeLanguage.findFirst({
        where: {
          challengeId,
          frameworkId,
        },
      });

      if (!template) {
        throw new NotFoundException();
      }

      const data = await this.prisma.challengeLanguage.findUnique({
        where: {
          id: Number(template.id),
        },
      });

      return { data: data };
    } catch (err) {
      throw err;
    }
  }
}
