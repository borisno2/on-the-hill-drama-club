/*
  Warnings:

  - A unique constraint covering the columns `[enrolment]` on the table `BillItem` will be added. If there are existing duplicate values, this will fail.
  - Made the column `quantity` on table `BillItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `BillItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Bill` ADD COLUMN `qboId` INTEGER NULL,
    ADD COLUMN `qboSyncToken` INTEGER NULL,
    ADD COLUMN `term` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `BillItem` ADD COLUMN `enrolment` VARCHAR(191) NULL,
    ADD COLUMN `qboId` INTEGER NULL,
    ADD COLUMN `qboSyncToken` INTEGER NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 1,
    MODIFY `amount` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Bill_term_idx` ON `Bill`(`term`);

-- CreateIndex
CREATE UNIQUE INDEX `BillItem_enrolment_key` ON `BillItem`(`enrolment`);
