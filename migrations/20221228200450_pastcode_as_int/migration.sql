/*
  Warnings:

  - You are about to alter the column `postcode` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `postcode` INTEGER NULL;
