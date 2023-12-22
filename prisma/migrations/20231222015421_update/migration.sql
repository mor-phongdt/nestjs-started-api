/*
  Warnings:

  - The primary key for the `StudySeriesChallenge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StudySeriesChallenge` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StudySeriesChallenge_seriesId_challengeId_key";

-- AlterTable
ALTER TABLE "StudySeriesChallenge" DROP CONSTRAINT "StudySeriesChallenge_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StudySeriesChallenge_pkey" PRIMARY KEY ("seriesId", "challengeId");
