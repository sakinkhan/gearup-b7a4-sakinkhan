/*
  Warnings:

  - You are about to drop the `GearItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_rentalOrderId_fkey";

-- DropForeignKey
ALTER TABLE "RentalOrder" DROP CONSTRAINT "RentalOrder_customerId_fkey";

-- DropForeignKey
ALTER TABLE "RentalOrderItem" DROP CONSTRAINT "RentalOrderItem_gearItemId_fkey";

-- DropForeignKey
ALTER TABLE "RentalOrderItem" DROP CONSTRAINT "RentalOrderItem_rentalOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_gearItemId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_rentalOrderId_fkey";

-- DropTable
DROP TABLE "GearItem";

-- CreateTable
CREATE TABLE "Gears" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "description" TEXT NOT NULL,
    "rentalPricePerDay" DOUBLE PRECISION NOT NULL,
    "depositAmount" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL,
    "availableStock" INTEGER NOT NULL,
    "condition" "GearCondition" NOT NULL,
    "status" "GearStatus" NOT NULL DEFAULT 'AVAILABLE',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gears_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Gears_providerId_idx" ON "Gears"("providerId");

-- CreateIndex
CREATE INDEX "Gears_categoryId_idx" ON "Gears"("categoryId");

-- CreateIndex
CREATE INDEX "Gears_status_idx" ON "Gears"("status");

-- CreateIndex
CREATE INDEX "Gears_condition_idx" ON "Gears"("condition");

-- AddForeignKey
ALTER TABLE "Gears" ADD CONSTRAINT "Gears_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gears" ADD CONSTRAINT "Gears_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "RentalOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalOrder" ADD CONSTRAINT "RentalOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalOrderItem" ADD CONSTRAINT "RentalOrderItem_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "RentalOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalOrderItem" ADD CONSTRAINT "RentalOrderItem_gearItemId_fkey" FOREIGN KEY ("gearItemId") REFERENCES "Gears"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_gearItemId_fkey" FOREIGN KEY ("gearItemId") REFERENCES "Gears"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_rentalOrderId_fkey" FOREIGN KEY ("rentalOrderId") REFERENCES "RentalOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
