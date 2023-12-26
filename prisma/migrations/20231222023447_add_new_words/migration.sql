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

CREATE UNIQUE INDEX "NewWords_word_key" ON "NewWords"("word");

