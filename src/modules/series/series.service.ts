import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
enum Tabs {
  CODING = 'Coding',
  SYSTEM = 'System design'
}
@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) { }
  async getListSeriesChallenge(tab: string, page: string, limit: string): Promise<{ data: any }> {
    const _page = Number(page)
    try {
      const listChallenge = await this.prisma.challenge.findMany({
        where: {
          category: Number(tab)
        },
        take: Number(limit),
        skip: Number(limit) * _page
      })
      if (listChallenge)
        return {
          data: {
            title: Object.values(Tabs).find((item, index) => index + 1 === Number(tab)),
            list: listChallenge
          }
        }
    } catch (error) {
      throw error
    }
  }
}