/*
  Warnings:

  - A unique constraint covering the columns `[quote]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quote_quote_key" ON "Quote"("quote");
