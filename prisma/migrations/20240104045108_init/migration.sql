/*
  Warnings:

  - You are about to drop the column `frameworkId` on the `Challenge` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `LanguageFramework` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_frameworkId_fkey";

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "frameworkId";

-- AlterTable
ALTER TABLE "LanguageFramework" ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudySeries" ADD COLUMN     "totalTime" INTEGER;

-- CreateTable
CREATE TABLE "SeriesUser" (
    "authorId" INTEGER NOT NULL,
    "seriesId" INTEGER NOT NULL,

    CONSTRAINT "SeriesUser_pkey" PRIMARY KEY ("authorId","seriesId")
);

-- CreateTable
CREATE TABLE "ChallengeLanguage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "template" JSONB NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "frameworkId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeLanguage_pkey" PRIMARY KEY ("challengeId","frameworkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeLanguage_id_key" ON "ChallengeLanguage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageFramework_name_key" ON "LanguageFramework"("name");

-- AddForeignKey
ALTER TABLE "SeriesUser" ADD CONSTRAINT "SeriesUser_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesUser" ADD CONSTRAINT "SeriesUser_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "StudySeries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeLanguage" ADD CONSTRAINT "ChallengeLanguage_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeLanguage" ADD CONSTRAINT "ChallengeLanguage_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "LanguageFramework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
