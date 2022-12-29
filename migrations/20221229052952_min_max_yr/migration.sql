/*
  Warnings:

  - You are about to drop the column `maximumYear` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `minimumYear` on the `Class` table. All the data in the column will be lost.
  - Added the required column `maxYear` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minYear` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Class` DROP COLUMN `maximumYear`,
    DROP COLUMN `minimumYear`,
    ADD COLUMN `maxYear` INTEGER NOT NULL,
    ADD COLUMN `minYear` INTEGER NOT NULL;
