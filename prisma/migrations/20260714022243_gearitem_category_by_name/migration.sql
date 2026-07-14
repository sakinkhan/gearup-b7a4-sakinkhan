/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Gears` table. All the data in the column will be lost.
  - Added the required column `categoryName` to the `Gears` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gears" DROP CONSTRAINT "Gears_categoryId_fkey";

-- DropIndex
DROP INDEX "Gears_categoryId_idx";

-- AlterTable
ALTER TABLE "Gears" DROP COLUMN "categoryId",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Gears_categoryName_idx" ON "Gears"("categoryName");

-- AddForeignKey
ALTER TABLE "Gears" ADD CONSTRAINT "Gears_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
