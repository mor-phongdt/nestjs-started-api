import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FrameworkService {
  constructor(private prisma: PrismaService) {}

  async getListFrameworks() {
    try {
      const list = await this.prisma.languageFramework.findMany({
        select: {
          name: true,
        },
      });
      return { data: list };
    } catch (err) {
      throw err;
    }
  }

  async getDetailFramework(id: number) {
    try {
      const data = await this.prisma.languageFramework.findUnique({
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

  async createFramework({ name }: Prisma.LanguageFrameworkCreateInput) {
    try {
      const data = await this.prisma.languageFramework.findUnique({
        where: {
          name,
        },
      });

      if (data) {
        throw new ConflictException();
      }

      await this.prisma.languageFramework.create({
        data: {
          name,
        },
      });

      return { message: 'success' };
    } catch (err) {
      throw err;
    }
  }

  async updateFramework(
    id: number,
    { name }: Prisma.LanguageFrameworkUpdateInput,
  ) {
    try {
      const data = await this.prisma.languageFramework.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!data) {
        throw new NotFoundException();
      }

      const update = await this.prisma.languageFramework.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
        },
      });

      if (update) {
        return { message: 'success' };
      }
    } catch (err) {
      throw err;
    }
  }

  async deleteFramework(id: number) {
    try {
      const data = await this.prisma.languageFramework.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!data) {
        throw new NotFoundException();
      }

      const deleted = await this.prisma.languageFramework.delete({
        where: {
          id: Number(id),
        },
      });

      if (deleted) {
        return { message: 'deleted' };
      }
    } catch (err) {
      throw err;
    }
  }
}
