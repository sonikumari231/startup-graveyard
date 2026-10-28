-- CreateTable
CREATE TABLE "feed_items" (
    "id" TEXT NOT NULL,
    "date" DATE,
    "month" VARCHAR(7),
    "when_label" TEXT,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "raised" TEXT NOT NULL,
    "causes" "cause_key"[] DEFAULT ARRAY[]::"cause_key"[],
    "why" TEXT NOT NULL,
    "source_title" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "feed_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feed_items_approved_date_idx" ON "feed_items"("approved", "date");

-- CreateIndex
CREATE INDEX "feed_items_approved_month_idx" ON "feed_items"("approved", "month");
