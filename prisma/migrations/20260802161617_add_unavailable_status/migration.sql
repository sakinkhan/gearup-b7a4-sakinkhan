/*
  Warnings:

  - The values [OUT_OF_STOCK] on the enum `GearStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GearStatus_new" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'INACTIVE');
ALTER TABLE "public"."Gears" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Gears" ALTER COLUMN "status" TYPE "GearStatus_new" USING ("status"::text::"GearStatus_new");
ALTER TYPE "GearStatus" RENAME TO "GearStatus_old";
ALTER TYPE "GearStatus_new" RENAME TO "GearStatus";
DROP TYPE "public"."GearStatus_old";
ALTER TABLE "Gears" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;
