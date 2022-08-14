/*
  Warnings:

  - A unique constraint covering the columns `[advice]` on the table `Advice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Advice_advice_key" ON "Advice"("advice");
