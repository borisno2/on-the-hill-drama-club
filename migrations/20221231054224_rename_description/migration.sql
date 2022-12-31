/*
  Warnings:

  - You are about to drop the column `desription` on the `Class` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Class` DROP COLUMN `desription`,
    ADD COLUMN `description` TEXT NULL;
