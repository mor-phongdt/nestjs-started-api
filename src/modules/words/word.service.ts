import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WordService {
  constructor(private prisma: PrismaService) { }

  async getWords(q: string, page: string, limit: string): Promise<any> {
    try {
      const args = {
        where: {},
        take: 0,
        skip: 0,
      };
      page
        ? (args.skip = parseInt(limit) * (parseInt(page) - 1))
        : delete args.skip;
      limit ? (args.take = parseInt(limit)) : delete args.take;
      q
        ? (args.where = {
          word: {
            contains: q,
          },
        })
        : delete args.where;
      // const data = await this.prisma.newWords.findMany(args);
      const [data, count] = await this.prisma.$transaction([
        this.prisma.newWords.findMany(args),
        this.prisma.newWords.count(),
      ]);
      const convertData = data.map((obj) => {
        if (typeof obj.definition === 'string') {
          obj.definition = JSON.parse(obj.definition);
        }
        return obj;
      });
      const meta = {
        total: count,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : count,
        totalPages: limit ? Math.ceil(count / parseInt(limit)) : 1,
      };
      return { data: { data: convertData, meta: meta } };
    } catch (error) {
      return { status: error.code, message: error.message };
    }
  }

  async createNewWord(
    data: Prisma.NewWordsCreateInput,
  ): Promise<{ message: string }> {
    try {
      const upsertWord = await this.prisma.newWords.create({
        data,
      });
      if (upsertWord) return { message: 'success' };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Word already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getWordById(id: string): Promise<any> {
    try {
      const word = await this.prisma.newWords.findUnique({
        where: {
          id: id,
        },
      });

      if (!word) {
        throw new NotFoundException();
      }

      return { data: word };
    } catch (error) {
      return { status: error.code, message: error.message };
    }
  }

  async deleteWord(id: string): Promise<any> {
    try {
      const word = await this.prisma.newWords.delete({
        where: {
          id: id,
        },
      });

      if (!word) {
        throw new NotFoundException();
      }

      return { message: 'deleted successfully' };
    } catch (error) {
      return { status: error.code, message: error.message };
    }
  }
}
