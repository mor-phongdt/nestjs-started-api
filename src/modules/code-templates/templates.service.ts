import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async getListTemplates() {
    try {
      const data = await this.prisma.codeTemplates.findMany({});

      return { data: data };
    } catch (err) {
      throw err;
    }
  }

  async getDetailTemplate(id: number) {
    try {
      const data = await this.prisma.codeTemplates.findUnique({
        where: {
          id,
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

  async createTemplate(data: Prisma.CodeTemplatesUncheckedCreateInput) {
    try {
      const template = await this.prisma.codeTemplates.create({
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
      const template = await this.prisma.codeTemplates.findUnique({
        where: {
          id,
        },
      });

      if (!template) {
        throw new NotFoundException();
      }

      const update = await this.prisma.codeTemplates.update({
        where: {
          id,
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
      const template = await this.prisma.codeTemplates.findUnique({
        where: {
          id,
        },
      });

      if (!template) {
        throw new NotFoundException();
      }

      const data = await this.prisma.codeTemplates.delete({
        where: {
          id,
        },
      });

      if (data) {
        return { message: 'deleted' };
      }
    } catch (err) {
      throw err;
    }
  }
}
