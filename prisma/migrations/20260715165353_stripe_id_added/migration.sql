/*
  Warnings:

  - You are about to alter the column `rentalPricePerDay` on the `Gears` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `depositAmount` on the `Gears` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalAmount` on the `RentalOrder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `pricePerDay` on the `RentalOrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalPrice` on the `RentalOrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCustomerId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gears" ALTER COLUMN "rentalPricePerDay" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "depositAmount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "RentalOrder" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "RentalOrderItem" ALTER COLUMN "pricePerDay" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeCustomerId_key" ON "Payment"("stripeCustomerId");
