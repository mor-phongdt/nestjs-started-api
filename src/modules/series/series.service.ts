import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) { }
  async getListSeriesChallenge(tab: string, page: string): Promise<{ data: any }> {
    const _page = Number(page)
    const tabs = ['Coding', 'System design']
    try {
      const listChallenge = await this.prisma.challenge.findMany({
        where: {
          category: tab
        }
      })
      if (listChallenge) return {
        data: {
          title: tabs.find((tab, index) => index === Number(tab)),
          list: listChallenge
        }
      }
    } catch (error) {
      throw error
    }
  }
}