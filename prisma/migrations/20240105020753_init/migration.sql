-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('preview', 'console');

-- CreateEnum
CREATE TYPE "ChallengeCategory" AS ENUM ('coding', 'system_design');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "lastLogin" TIMESTAMPTZ(3),
    "position" TEXT,
    "theme_ide" TEXT DEFAULT 'default',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "spendTime" INTEGER,
    "userCompleted" INTEGER DEFAULT 0,
    "level" INTEGER,
    "authorId" INTEGER NOT NULL,
    "codeTemplate" JSONB NOT NULL,
    "codeSolution" JSONB NOT NULL,
    "codeTest" JSONB NOT NULL,
    "solutionDescription" TEXT,
    "frameworkId" INTEGER NOT NULL,
    "category" "ChallengeCategory" NOT NULL DEFAULT 'coding',
    "status" INTEGER NOT NULL DEFAULT 1,
    "type" "ChallengeType" NOT NULL DEFAULT 'preview',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionChallenge" (
    "id" SERIAL NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" TEXT,
    "status" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMPTZ(3) NOT NULL,
    "endTime" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewSubmission" (
    "id" SERIAL NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "parentCommentId" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadReview" (
    "reviewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "readAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadReview_pkey" PRIMARY KEY ("reviewId","userId")
);

-- CreateTable
CREATE TABLE "ReactionReview" (
    "reviewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ReactionReview_pkey" PRIMARY KEY ("reviewId","userId")
);

-- CreateTable
CREATE TABLE "LanguageFramework" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LanguageFramework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySeries" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalTime" INTEGER,
    "image_url" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySeriesChallenge" (
    "seriesId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudySeriesChallenge_pkey" PRIMARY KEY ("seriesId","challengeId")
);

-- CreateTable
CREATE TABLE "SeriesUser" (
    "authorId" INTEGER NOT NULL,
    "seriesId" INTEGER NOT NULL,

    CONSTRAINT "SeriesUser_pkey" PRIMARY KEY ("authorId","seriesId")
);

-- CreateTable
CREATE TABLE "NewWords" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "definition" JSONB NOT NULL,
    "example" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewWords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionChallenge_challengeId_userId_key" ON "SubmissionChallenge"("challengeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NewWords_word_key" ON "NewWords"("word");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "LanguageFramework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionChallenge" ADD CONSTRAINT "SubmissionChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionChallenge" ADD CONSTRAINT "SubmissionChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewSubmission" ADD CONSTRAINT "ReviewSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewSubmission" ADD CONSTRAINT "ReviewSubmission_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SubmissionChallenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadReview" ADD CONSTRAINT "ReadReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "ReviewSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadReview" ADD CONSTRAINT "ReadReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySeries" ADD CONSTRAINT "StudySeries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySeriesChallenge" ADD CONSTRAINT "StudySeriesChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudySeriesChallenge" ADD CONSTRAINT "StudySeriesChallenge_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "StudySeries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesUser" ADD CONSTRAINT "SeriesUser_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeriesUser" ADD CONSTRAINT "SeriesUser_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "StudySeries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
