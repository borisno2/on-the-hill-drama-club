/*
  Warnings:

  - You are about to drop the column `xeroId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `xeroAccountCode` on the `LessonCategory` table. All the data in the column will be lost.
  - You are about to drop the `XeroSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Account_xeroId_key";

-- DropIndex
DROP INDEX "LessonCategory_xeroAccountCode_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "xeroId";

-- AlterTable
ALTER TABLE "LessonCategory" DROP COLUMN "xeroAccountCode";

-- DropTable
DROP TABLE "XeroSettings";
