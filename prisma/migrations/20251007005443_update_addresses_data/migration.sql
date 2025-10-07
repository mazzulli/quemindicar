/*
  Warnings:

  - You are about to alter the column `address` on the `providers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(80)`.

*/
-- AlterTable
ALTER TABLE "providers" ADD COLUMN     "city" VARCHAR(50),
ADD COLUMN     "complement" VARCHAR(50),
ADD COLUMN     "neighborhood" VARCHAR(50),
ADD COLUMN     "number" VARCHAR(10),
ADD COLUMN     "state" CHAR(2),
ADD COLUMN     "zipCode" VARCHAR(9),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(80);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "stripeId" VARCHAR(255);
