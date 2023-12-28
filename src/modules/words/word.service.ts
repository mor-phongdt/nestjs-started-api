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
  constructor(private prisma: PrismaService) {}

  async getWords(): Promise<any> {
    try {
      const data = await this.prisma.newWords.findMany();

      return { data: data };
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

  async getWordById(id: number): Promise<any> {
    try {
      const word = await this.prisma.newWords.findUnique({
        where: {
          id: Number(id),
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

  async deleteWord(id: number): Promise<any> {
    try {
      const word = await this.prisma.newWords.delete({
        where: {
          id: Number(id),
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
