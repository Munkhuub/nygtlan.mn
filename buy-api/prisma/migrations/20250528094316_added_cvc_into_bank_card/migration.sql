/*
  Warnings:

  - Added the required column `cvc` to the `BankCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankCard" ADD COLUMN     "cvc" TEXT NOT NULL,
ALTER COLUMN "expiryDate" SET DATA TYPE TEXT;
