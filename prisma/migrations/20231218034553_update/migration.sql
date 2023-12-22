/*
  Warnings:

  - You are about to drop the column `userId` on the `StudySeriresChallenge` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `StudySeriresChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudySeriresChallenge" DROP CONSTRAINT "StudySeriresChallenge_userId_fkey";

-- AlterTable
ALTER TABLE "StudySeriresChallenge" DROP COLUMN "userId",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StudySeriresChallenge" ADD CONSTRAINT "StudySeriresChallenge_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
