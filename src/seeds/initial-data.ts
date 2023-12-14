import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { codeSample, language, sampleMarkdown } from './users-data';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

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
          frameworkId: Number(
            [1, 2, 3, 4, 5][Math.floor(Math.random() * [1, 2, 3, 4, 5].length)],
          ),
          category: Number([1, 2][Math.floor(Math.random() * [1, 2].length)]),
          status: 1,
          type: Number([1, 2][Math.floor(Math.random() * [1, 2].length)]),
        },
      });
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
