-- CreateEnum
CREATE TYPE "cause_key" AS ENUM ('market', 'cash', 'cost', 'product', 'compete', 'timing', 'fraud', 'scale', 'legal', 'focus', 'growth', 'model');

-- CreateTable
CREATE TABLE "startups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "what" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "hq" TEXT NOT NULL,
    "founded" INTEGER,
    "closed_year" INTEGER NOT NULL,
    "closed_label" TEXT NOT NULL,
    "raised_millions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "founders" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "investors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "competitors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lesson" TEXT NOT NULL,
    "wiki_query" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "startups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_reasons" (
    "id" SERIAL NOT NULL,
    "startup_id" TEXT NOT NULL,
    "cause" "cause_key" NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "startup_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_timeline" (
    "id" SERIAL NOT NULL,
    "startup_id" TEXT NOT NULL,
    "when_label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "startup_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_sources" (
    "id" SERIAL NOT NULL,
    "startup_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "startup_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "startup_reasons_startup_id_idx" ON "startup_reasons"("startup_id");

-- CreateIndex
CREATE INDEX "startup_timeline_startup_id_idx" ON "startup_timeline"("startup_id");

-- CreateIndex
CREATE INDEX "startup_sources_startup_id_idx" ON "startup_sources"("startup_id");

-- AddForeignKey
ALTER TABLE "startup_reasons" ADD CONSTRAINT "startup_reasons_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startup_timeline" ADD CONSTRAINT "startup_timeline_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startup_sources" ADD CONSTRAINT "startup_sources_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
