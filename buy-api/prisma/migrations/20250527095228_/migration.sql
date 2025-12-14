/*
  Warnings:

  - You are about to drop the column `SocialMideaUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `succesMessage` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `socialMediaUrl` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `successMessage` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "SocialMideaUrl",
DROP COLUMN "succesMessage",
ADD COLUMN     "socialMediaUrl" TEXT NOT NULL,
ADD COLUMN     "successMessage" TEXT NOT NULL;
