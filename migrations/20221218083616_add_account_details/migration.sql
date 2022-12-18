/*
  Warnings:

  - You are about to drop the column `name` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Account` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `postcode` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `streetAddress` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `suburb` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `surname` VARCHAR(191) NOT NULL DEFAULT '';
