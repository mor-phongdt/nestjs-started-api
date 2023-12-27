import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ChallengeCategory, Prisma, StudySeries } from "@prisma/client";
import { SeriesDto, UpdateSeriesDto } from "./dto/series-dto";
import { IUser } from "src/types/user/index.type";

enum Tabs {
  coding = 'Coding',
  system_design = 'System design'
}

// interface

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) { }

  async getListChallengeByCategory(tab: ChallengeCategory, page: string, limit: string, seriesId: string): Promise<{ data: any }> {
    // const _tab = parseInt(tab)
    const _page = parseInt(page)
    const _limit = parseInt(limit)

    try {
      const listChallenge = await this.prisma.challenge.findMany({
        where: {
          category: tab,

        },
        take: _limit,
        skip: _limit * _page
      })
      if (listChallenge)
        return {
          data: {
            title: Tabs[tab],
            list: listChallenge
          }
        }
    } catch (error) {
      throw error
    }
  }

  async getListFrameWork(): Promise<{ data: any }> {
    try {
      const listFrameWork = await this.prisma.languageFramework.findMany()
      if (listFrameWork)
        return {
          data: listFrameWork
        }
    } catch (error) {
      throw error
    }
  }

  async getListChallengeByFrameWork(id: string, tab: ChallengeCategory, page: string, limit: string): Promise<{ data: any }> {
    try {
      const _id = parseInt(id)
      const _page = parseInt(page)
      const _limit = parseInt(limit)
      const _tab = parseInt(tab)
      const listChallenge = await this.prisma.challenge.findMany({
        where: {
          frameworkId: _id,
          category: tab
        },
        take: _limit,
        skip: _limit * _page,

      })
      const series = await this.prisma.languageFramework.findUnique({
        where: {
          id: _id
        },
        select: {
          id: true,
          name: true,
          imageUrl: true
        }
      })
      const tabs = await this.prisma.challenge.groupBy({
        by: ['category'],
        _count: {
          category: true
        },
        orderBy: {
          category: 'asc'
        }
      })
      if (listChallenge)
        return {
          data: {
            ...series,
            tabs: Object.values(tabs).map(value => ({
              id: value.category,
              name: Tabs[tab],
              count: value._count.category
            })),
            listChallenge: listChallenge,
          }
        }
    } catch (error) {
      throw error
    }
  }
  //ignore update series feature
  async updateSeriesChallenge(req: any): Promise<{ message: string }> {
    try {
      const seriesSelectedList = this.prisma.challenge
      return { message: 'Successfully' }
    } catch (error) {

      throw error
    }
  }

  async createSeries(seriesData: SeriesDto, user: IUser): Promise<{ message: string }> {
    try {
      console.log(user)
      const insertSeries = await this.prisma.studySeries.create({
        data: {
          authorId: user.id,
          name: seriesData.name,
          description: seriesData.description,
          status: seriesData.status,
          image_url: seriesData.image_url
        },
      })

      const updateChallenges = await this.prisma.studySeriesChallenge.createMany({
        data: seriesData.listChallenge?.map(id => ({
          seriesId: insertSeries.id,
          challengeId: Number(id)
        })),
        skipDuplicates: true
      })

      if (updateChallenges)
        return { message: 'Successfully' }
    } catch (error) {
      throw error
    }
  }

  async updateSeries(series: UpdateSeriesDto): Promise<{ data: any }> {
    try {
      const existingChallenge = await this.prisma.studySeriesChallenge.findMany({
        where: {
          seriesId: { in: series.challenges }
        }
      })

      const existingChallengeIds = existingChallenge.map(record => record.challengeId)
      const updateChallengeIds = series.challenges.filter(id => !existingChallengeIds.includes(id))

      updateChallengeIds.map(async (id) => {
        await this.prisma.studySeriesChallenge.create({
          data: {
            seriesId: series.seriesId,
            challengeId: id
          }
        })
      })
      return { data: existingChallenge }
    } catch (error) {
      throw error
    }
  }

  async deleteSeries(id: string, user: IUser): Promise<{ message: string }> {
    try {
      const series = await this.prisma.studySeries.delete({
        where: {
          id: parseInt(id),
          authorId: user.id
        }
      })
      if (series)
        return { message: 'Deleted Successfully' }
    } catch (error) {
      throw error
    }
  }

  async getAllSeries(page: string, limit: string): Promise<{ data: any }> {
    try {
      const _limit = parseInt(limit)
      const _page = parseInt(page)
      const listSeries = await this.prisma.studySeries.findMany({
        select: {
          id: true,
          authorId: true,
          name: true,
          description: true,
          image_url: true,
          status: true,
          updatedAt: true
        },
        take: _limit,
        skip: _limit * _page
      })
      if (listSeries)
        return { data: listSeries }
    } catch (error) {
      throw error
    }
  }


  async getListChallengeBySeries(id: string, page: string, limit: string): Promise<{ data: any }> {
    try {
      const seriesDetail = await this.prisma.studySeries.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          studySeriesChallenge: {
            select: {
              challenge: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  spendTime: true,
                  userCompleted: true,
                  level: true,
                  frameworkId: true,
                  status: true,
                  updatedAt: true,
                  category: true
                }
              }
            },
            take: parseInt(limit),
            skip: parseInt(limit) * parseInt(page)
          },
        },

      })

      const _studySeriesChallenge = []
      seriesDetail.studySeriesChallenge.map(item => {
        _studySeriesChallenge.push(item.challenge)
      })

      if (seriesDetail)
        return {
          data: {
            detail: {
              ...seriesDetail, studySeriesChallenge: {
                coding: _studySeriesChallenge.filter(item => item.category === 'coding'),
                system: _studySeriesChallenge.filter(item => item.category === 'system_design')
              }
            }
          }
        }
    } catch (error) {
      throw error
    }
  }
}