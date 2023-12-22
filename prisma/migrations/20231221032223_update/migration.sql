/*
  Warnings:

  - A unique constraint covering the columns `[seriesId,challengeId]` on the table `StudySeriesChallenge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudySeriesChallenge_seriesId_challengeId_key" ON "StudySeriesChallenge"("seriesId", "challengeId");
