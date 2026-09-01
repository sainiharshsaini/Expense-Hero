/*
  Warnings:

  - A unique constraint covering the columns `[issuer,accountId]` on the table `auth_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `issuer` to the `auth_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "auth_accounts_providerId_accountId_key";

-- AlterTable
ALTER TABLE "auth_accounts" ADD COLUMN     "issuer" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "auth_accounts_issuer_accountId_key" ON "auth_accounts"("issuer", "accountId");
