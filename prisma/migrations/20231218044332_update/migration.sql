/*
  Warnings:

  - You are about to drop the `StudySerires` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudySeriresChallenge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudySeriresChallenge" DROP CONSTRAINT "StudySeriresChallenge_authorId_fkey";

-- DropForeignKey
ALTER TABLE "StudySeriresChallenge" DROP CONSTRAINT "StudySeriresChallenge_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "StudySeriresChallenge" DROP CONSTRAINT "StudySeriresChallenge_seriesId_fkey";

-- DropTable
DROP TABLE "StudySerires";

-- DropTable
DROP TABLE "StudySeriresChallenge";

-- CreateTable
CREATE TABLE "StudySeries" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySeriesChallenge" (
    "id" SERIAL NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySeriesChallenge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudySeries" ADD CONSTRAINT "StudySeries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySeriesChallenge" ADD CONSTRAINT "StudySeriesChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySeriesChallenge" ADD CONSTRAINT "StudySeriesChallenge_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "StudySeries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
