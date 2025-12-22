/*
  Warnings:

  - The values [ASSET,LIABILITY] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[entryNumber,companyId]` on the table `JournalEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalSide` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entryNumber` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ACCOUNTANT', 'USER');

-- CreateEnum
CREATE TYPE "NormalSide" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('MNT', 'USD', 'EUR', 'KRW', 'CNY', 'JPY', 'RUB');

-- CreateEnum
CREATE TYPE "JournalEntryStatus" AS ENUM ('DRAFT', 'POSTED', 'VOID');

-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('CURRENT_ASSET', 'NON_CURRENT_ASSET', 'CURRENT_LIABILITY', 'NON_CURRENT_LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE', 'COST_OF_GOODS_SOLD');
ALTER TABLE "Account" ALTER COLUMN "type" TYPE "AccountType_new" USING ("type"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "public"."AccountType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isTaxAccount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "normalSide" "NormalSide" NOT NULL,
ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT,
ADD COLUMN     "baseCurrency" "Currency" NOT NULL DEFAULT 'MNT',
ADD COLUMN     "email" TEXT,
ADD COLUMN     "fiscalYearStart" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "entryNumber" TEXT NOT NULL,
ADD COLUMN     "periodId" INTEGER,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "status" "JournalEntryStatus" NOT NULL DEFAULT 'POSTED';

-- AlterTable
ALTER TABLE "JournalLine" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'MNT',
ADD COLUMN     "exchangeRate" DECIMAL(15,6),
ADD COLUMN     "lineOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "memo" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "AccountingPeriod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "closedAt" TIMESTAMP(3),
    "closedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "journalEntryId" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountingPeriod_companyId_idx" ON "AccountingPeriod"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountingPeriod_companyId_startDate_endDate_key" ON "AccountingPeriod"("companyId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "Attachment_journalEntryId_idx" ON "Attachment"("journalEntryId");

-- CreateIndex
CREATE INDEX "Account_companyId_idx" ON "Account"("companyId");

-- CreateIndex
CREATE INDEX "Account_type_idx" ON "Account"("type");

-- CreateIndex
CREATE INDEX "Account_parentId_idx" ON "Account"("parentId");

-- CreateIndex
CREATE INDEX "Company_userId_idx" ON "Company"("userId");

-- CreateIndex
CREATE INDEX "JournalEntry_companyId_idx" ON "JournalEntry"("companyId");

-- CreateIndex
CREATE INDEX "JournalEntry_date_idx" ON "JournalEntry"("date");

-- CreateIndex
CREATE INDEX "JournalEntry_status_idx" ON "JournalEntry"("status");

-- CreateIndex
CREATE INDEX "JournalEntry_periodId_idx" ON "JournalEntry"("periodId");

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_entryNumber_companyId_key" ON "JournalEntry"("entryNumber", "companyId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "AccountingPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountingPeriod" ADD CONSTRAINT "AccountingPeriod_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
