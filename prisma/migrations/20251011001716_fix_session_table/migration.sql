/*
  Warnings:

  - You are about to drop the column `created_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."sessions_token_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "ip_address",
DROP COLUMN "token",
DROP COLUMN "user_agent";
