import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { Prisma, StudySeries } from "@prisma/client";
import { SeriesDto } from "./dto/series-dto";
import { IUser } from "src/types/user/index.type";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";


enum Tabs {
  CODING = 'Coding',
  SYSTEM = 'System design'
}

// interface

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) { }


  async getListChallengeByCategory(tab: string, page: string, limit: string, seriesId: string): Promise<{ data: any }> {
    const _tab = parseInt(tab)
    const _page = parseInt(page)
    const _limit = parseInt(limit)

    try {
      const listChallenge = await this.prisma.challenge.findMany({
        where: {
          category: _tab,

        },
        take: _limit,
        skip: _limit * _page
      })
      if (listChallenge)
        return {
          data: {
            title: Object.values(Tabs).find((item, index) => index + 1 === _tab),
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

  async getListChallengeByFrameWork(id: string, tab: string, page: string, limit: string): Promise<{ data: any }> {
    try {
      const _id = parseInt(id)
      const _page = parseInt(page)
      const _limit = parseInt(limit)
      const _tab = parseInt(tab)
      const listChallenge = await this.prisma.challenge.findMany({
        where: {
          frameworkId: _id,
          category: _tab
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
              name: Object.values(Tabs).find((item, index) => index + 1 === value.category),
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
                equals: {
                  id: true
                }
              }
            },
          }
        }
      })
      const _studySeriesChallenge = seriesDetail.studySeriesChallenge.map(item => {
        return { ...item.challenge }
      })
      if (seriesDetail)
        return { data: { detail: { ...seriesDetail, studySeriesChallenge: _studySeriesChallenge } } }
    } catch (error) {
      throw error
    }
  }
}