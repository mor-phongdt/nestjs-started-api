import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { codeSample, language, sampleMarkdown } from './users-data';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export enum ChallengeTypeEnum {
  preview = 'preview',
  console = 'console',
}

export enum ChallengeCategoryEnum {
  coding = 'coding',
  system_design = 'system_design',
}

async function seed() {
  try {
    const salt = await bcrypt.genSalt();
    for (let i = 1; i <= 10; i++) {
      const password = await bcrypt.hash('admin', salt);
      await prisma.user.create({
        data: {
          id: i,
          email: `admin${i}@gmail.com`,
          password: password,
          nickname: faker.internet.displayName(),
          avatarUrl: faker.image.avatar(),
        },
      });
    }
    await prisma.languageFramework.createMany({
      data: language,
    });
    for (let i = 1; i <= 10; i++) {
      await prisma.challenge.create({
        data: {
          id: i,
          title: faker.lorem.slug(),
          description: sampleMarkdown,
          spendTime: 360,
          userCompleted: 0,
          level: [1, 2, 3][Math.floor(Math.random() * [1, 2, 3].length)],
          authorId: i,
          codeTemplate: JSON.stringify(codeSample),
          codeSolution: JSON.stringify(codeSample),
          codeTest: JSON.stringify(codeSample),
          solutionDescription: sampleMarkdown,
          category: [
            ChallengeCategoryEnum.coding,
            ChallengeCategoryEnum.system_design,
          ][
            Math.floor(
              Math.random() *
                [
                  ChallengeCategoryEnum.coding,
                  ChallengeCategoryEnum.system_design,
                ].length,
            )
          ],
          status: 1,
          type: [ChallengeTypeEnum.preview, ChallengeTypeEnum.preview][
            Math.floor(
              Math.random() *
                [ChallengeTypeEnum.preview, ChallengeTypeEnum.preview].length,
            )
          ],
        },
      });
      await prisma.challengeLanguage.create({
        data: {
          id: i,
          name: `Template ${i}`,
          description: `This is template ${i}`,
          template: JSON.stringify(codeSample),
          challengeId: i,
          frameworkId: Math.random() * 5 + 1,
        },
      });
    }

    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id)+1, 1), false) FROM "User";`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"LanguageFramework"', 'id'), coalesce(max(id)+1, 1), false) FROM "LanguageFramework";`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Challenge"', 'id'), coalesce(max(id)+1, 1), false) FROM "Challenge";`;
  } catch (error) {
    console.error('Error seeding initial data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
