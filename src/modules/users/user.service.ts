import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (user) return { user };
      else throw new NotFoundException('User not found');
    } catch (error) {
      throw error;
    }
  }

  async updateUser(): Promise<any> {}

  async deleteUser(): Promise<any> {}
}
