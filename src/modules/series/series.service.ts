import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ChallengeCategory, Prisma, StudySeries } from "@prisma/client";
import { PaginationQueryParams, SeriesDto, StudySeriesChallengeDto } from "./dto/series-dto";
import { IUser } from "src/types/user/index.type";
import { IQueryParams, ISeriesRequest, ISeriesUpdate } from "src/types/series/index.type";


@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) { }

  async createSeries(seriesData: ISeriesRequest, listChallenge: Array<number>): Promise<{ message: string }> {
    try {

      const series = await this.prisma.studySeries.create({
        data: {
          ...seriesData,
        },
      })

      const users = await
        this.prisma.challenge.findMany({
          where: {
            id: { in: listChallenge }
          },
          select: {
            authorId: true
          }
        })

      const updateChallenges = await this.prisma.studySeriesChallenge.createMany({
        data: listChallenge.map(id => ({
          seriesId: series.id,
          challengeId: Number(id)
        })),
        skipDuplicates: true
      })

      const challenges = await this.prisma.studySeriesChallenge.findMany({
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

  // async updateSeries(series: ISeriesUpdate, user: IUser, id: string): Promise<{ message: string }> {
  //   try {
  //     const _id = parseInt(id)
  //     const currSeries = await this.prisma.studySeries.findUnique({
  //       where: {
  //         id: _id
  //       }
  //     })

  //     if (currSeries) {
  //       if (user.id !== currSeries.authorId) {
  //         throw new UnauthorizedException('You do not have permission to edit')
  //       }
  //     }
  //     else {
  //       throw new NotFoundException('Not found!')
  //     }

  //     const upsertSeries = await this.prisma.studySeries.update({
  //       where: {
  //         id: parseInt(id)
  //       },
  //       data: {
  //         ...series
  //       }
  //     })
  //     return { message: 'hihi' }
  //   } catch (error) {

  //   }
  // }

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

  async getAllSeries(query: PaginationQueryParams): Promise<{ data: any }> {
    try {
      const _limit = parseInt(query.limit)
      const _page = parseInt(query.page)

      const series = await this.prisma.studySeries.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          image_url: true,
          status: true,
          updatedAt: true,
          _count: {
            select: {
              studySeriesChallenge: true,
            },
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
      })

      const totalRecord = await this.prisma.studySeries.count({
        select: {
          _all: true
        }
      })

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
              totalPages: Math.ceil(totalRecord._all / _limit)
            }
          }
        }
    } catch (error) {
      throw error
    }
  }

}