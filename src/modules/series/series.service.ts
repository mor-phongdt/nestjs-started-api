import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ChallengeCategory, Prisma, StudySeries } from "@prisma/client";
import { PaginationQueryParams, SeriesDto, StudySeriesChallengeDto } from "./dto/series-dto";
import { IUser } from "src/types/user/index.type";
import { IQueryParams, ISeriesCreateRequest } from "src/types/series/index.type";


@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) { }

  async createSeries(seriesData: ISeriesCreateRequest, listChallenge: Array<number>): Promise<{ message: string }> {
    try {
      const [users, series] = await this.prisma.$transaction([
        this.prisma.challenge.findMany({
          where: {
            id: { in: listChallenge }
          },
          select: {
            authorId: true
          }
        }),
        this.prisma.studySeries.create({
          data: {
            ...seriesData,

          },
        }),

      ])

      const [updateChallenges, challenges] = await this.prisma.$transaction([
        this.prisma.studySeriesChallenge.createMany({
          data: listChallenge.map(id => ({
            seriesId: series.id,
            challengeId: Number(id)
          })),
          skipDuplicates: true
        }),
        this.prisma.studySeriesChallenge.findMany({
          where: {
            seriesId: series.id
          },
          include: {
            challenge: {
              select: {
                spendTime: true
              }
            }
          }
        })
      ])

      const updateSeries = await this.prisma.studySeries.update({
        where: {
          id: series.id
        },
        data: {
          totalTime: challenges.map(item => item.challenge.spendTime).reduce((acc, curr) => acc + curr, 0)
        }
      })

      users.map(async (item) => {
        await this.prisma.seriesUser.create({
          data: {
            seriesId: series.id,
            authorId: item.authorId
          }
        })
      })

      if (updateSeries && updateChallenges)
        return { message: 'Successfully' }
    } catch (error) {
      throw error
    }
  }

  // Update title, description,level, spend time...
  async updateSeries(): Promise<{ message: string }> {
    try {
      return { message: 'hihi' }
    } catch (error) {

    }
  }

  async updateSeriesChallenge(series: StudySeriesChallengeDto): Promise<{ data: any }> {
    try {

      const updateSeries = await this.prisma.studySeries.update({
        where: {
          id: series.seriesId
        },
        data: {
          name: series.name,
          description: series.description,
          status: series.status,
          image_url: series.image_url,
        }
      })

      series.listChallenge.map(async (id) => {
        await this.prisma.studySeriesChallenge.create({
          data: {
            seriesId: series.seriesId,
            challengeId: id
          }
        })
      })
      return { data: [] }
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

  //Delete challenge in series
  async deleteChallengeFromSeries(): Promise<{ message: string }> {
    try {
      return { message: 'hihi' }
    } catch (error) {

    }
  }

  async getAllSeries(query: PaginationQueryParams): Promise<{ data: any }> {
    try {
      const _limit = parseInt(query.limit)
      const _page = parseInt(query.page)

      const [series, totalRecord] = await this.prisma.$transaction([
        this.prisma.studySeries.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
            status: true,
            updatedAt: true,
            _count: {
              select: {
                studySeriesChallenge: true
              }
            },
            contributors: {
              select: {
                user: {
                  select:
                  {
                    id: true,
                    nickname: true,
                    avatarUrl: true
                  }
                }
              }
            },
          },
          take: _limit,
          skip: _limit * _page
        }),
        this.prisma.studySeries.count()
      ])

      const flattenedListSeries = series.map(({ _count, contributors, ...item }) => ({
        ...item,
        challenges: _count.studySeriesChallenge,
        contributors: contributors.map(user => user.user),
      }))
      if (series)
        return {
          data:
          {
            series: flattenedListSeries,
            meta: {
              total: series.length,
              page: _page,
              limit: _limit,
              totalPages: Math.ceil(totalRecord / _limit)
            }
          }
        }
    } catch (error) {
      throw error
    }
  }


  async getListChallengeBySeries(query: IQueryParams): Promise<{ data: any }> {
    try {
      const seriesDetail = await this.prisma.studySeries.findUnique({
        where: {
          id: parseInt(query.id),
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
            take: parseInt(query.limit),
            skip: parseInt(query.limit) * parseInt(query.page)
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
                coding: _studySeriesChallenge.filter(item => item.category === 'coding' && query.tab === 'coding'),
                system: _studySeriesChallenge.filter(item => item.category === 'system_design' && query.tab === 'system_design')
              }
            }
          }
        }
    } catch (error) {
      throw error
    }
  }
}