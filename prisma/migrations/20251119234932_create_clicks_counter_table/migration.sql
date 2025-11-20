-- CreateTable
CREATE TABLE "clicksCounter" (
    "id" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "clicksCounter_id_key" ON "clicksCounter"("id");

-- AddForeignKey
ALTER TABLE "clicksCounter" ADD CONSTRAINT "clicksCounter_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
