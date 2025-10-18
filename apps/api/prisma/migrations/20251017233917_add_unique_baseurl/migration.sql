/*
  Warnings:

  - A unique constraint covering the columns `[baseUrl]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Source_baseUrl_key" ON "Source"("baseUrl");
