/*
  Warnings:

  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Student` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `surname` VARCHAR(191) NOT NULL DEFAULT '';
