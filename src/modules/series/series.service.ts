import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { PaginationQueryParams } from "./dto/series-dto";
import { IUser } from "src/types/user/index.type";
import { ISeriesRequest, ISeriesUpdate } from "src/types/series/index.type";

@Injectable()
export class SeriesService {
  constructor(private prisma: PrismaService) { }

  async createSeries(seriesData: ISeriesRequest, listChallenge: Array<number>): Promise<{ message: string }> {
    try {

      const series = listChallenge ? await this.prisma.studySeries.create({
        data: {
          ...seriesData,
        },
      }) : { id: null }

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

  async updateSeries(series: ISeriesUpdate, user: IUser): Promise<{ message: string }> {
    try {
      const { id, ...rest } = series
      const _id = parseInt(id)

      const currSeries = await this.prisma.studySeries.findUnique({
        where: {
          id: _id
        }
      })

      if (currSeries) {
        if (user.id !== currSeries.authorId) {
          throw new UnauthorizedException('You do not have permission to edit')
        }
      }
      else {
        throw new NotFoundException('Not found!')
      }

      const upsertSeries = await this.prisma.studySeries.update({
        where: {
          id: _id
        },
        data: {
          ...rest
        }
      })
      if (upsertSeries)
        return { message: 'Updated' }
    } catch (error) {

    }
  }

  async deleteSeries(id: string, user: IUser): Promise<{ message: string }> {
    return await this.prisma.$transaction(async () => {
      const series = await this.prisma.studySeries.findUnique({
        where: {
          id: parseInt(id)
        }
      })
      if (series) {
        if (series.authorId === user.id) {
          await this.prisma.$transaction([
            this.prisma.studySeriesChallenge.deleteMany({
              where: {
                seriesId: parseInt(id)
              }
            }),
            this.prisma.seriesUser.deleteMany({
              where: {
                seriesId: parseInt(id)
              }
            }),
            this.prisma.studySeries.delete({
              where: {
                id: parseInt(id),
                authorId: user.id
              }
            })
          ])
          return { message: 'Deleted' }
        } else
          return { message: '' }
      } else {
        return { message: '' }
      }
    })
  }

  async getAllSeries(query: PaginationQueryParams, user: IUser): Promise<{ data: any }> {
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
          studySeriesChallenge: {
            select: {
              challenge: {
                select: {
                  spendTime: true,
                  submissionChallenge: {
                    where: {
                      userId: user.id
                    },
                    select: {
                      challengeId: true,
                      userId: true,
                      status: true
                    }
                  }
                }
              }
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
      })

      const totalRecord = await this.prisma.studySeries.count({
        select: {
          _all: true
        }
      })

      const flattenedListSeries = series.map(({ _count, contributors, studySeriesChallenge, ...item }) => ({
        ...item,
        duration: studySeriesChallenge.reduce((acc, curr) => {
          return acc + curr.challenge.spendTime
        }, 0),
        challenges: _count.studySeriesChallenge,
        progress: Math.floor(100 * studySeriesChallenge.filter(item => item.challenge.submissionChallenge[0]?.status === 999).length / _count.studySeriesChallenge) || 0,
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

  async getDetailSeries(id: string, user: IUser): Promise<{ data: any, message: string }> {
    try {
      const series = await this.prisma.studySeries.findMany({
        where: {
          id: parseInt(id)
        },
        select: {
          id: true,
          name: true,
          authorId: true,
          description: true,
          image_url: true,
          status: true,
          updatedAt: true,
          _count: {
            select: {
              studySeriesChallenge: true
            }
          },
          studySeriesChallenge: {
            select: {
              challenge: {
                select: {
                  id: true,
                  title: true,
                  spendTime: true,
                  submissionChallenge: {
                    where: {
                      userId: user.id
                    },
                    select: {
                      status: true
                    }
                  }
                }
              }
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
          }
        }
      })

      const flattenedSeries = series.map(({ _count, studySeriesChallenge, contributors, ...item }) => ({
        ...item,
        duration: studySeriesChallenge.reduce((acc, curr) => {
          return acc + curr.challenge.spendTime
        }, 0),

        count: _count.studySeriesChallenge,
        challenges: studySeriesChallenge.map(item => ({
          id: item.challenge.id,
          title: item.challenge.title,
          spendTime: item.challenge.spendTime,
          status: item.challenge.submissionChallenge[0]?.status || 0
        })),
        contributors: contributors.map(user => user.user),
      }))

      return { data: flattenedSeries[0], message: flattenedSeries[0] ? 'Successfully' : 'Not found!' }
    } catch (error) {
      throw error
    }
  }
}