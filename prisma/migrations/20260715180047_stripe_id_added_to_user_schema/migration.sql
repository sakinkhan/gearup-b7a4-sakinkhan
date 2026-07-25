/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payment_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "stripeCustomerId";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_stripeCustomerId_key" ON "Users"("stripeCustomerId");
