/*
  Warnings:

  - A unique constraint covering the columns `[customerId,gearItemId,rentalOrderId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_customerId_gearItemId_rentalOrderId_key" ON "Review"("customerId", "gearItemId", "rentalOrderId");
