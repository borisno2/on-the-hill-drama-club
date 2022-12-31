/*
  Warnings:

  - You are about to drop the column `class` on the `Enrolment` table. All the data in the column will be lost.
  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Enrolment_class_idx` ON `Enrolment`;

-- AlterTable
ALTER TABLE `Enrolment` DROP COLUMN `class`,
    ADD COLUMN `lesson` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Class`;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `time` VARCHAR(191) NOT NULL DEFAULT '',
    `day` VARCHAR(191) NOT NULL,
    `minYear` INTEGER NOT NULL,
    `maxYear` INTEGER NOT NULL,
    `cost` DECIMAL(18, 2) NULL,
    `quantity` INTEGER NULL,
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `type` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Enrolment_lesson_idx` ON `Enrolment`(`lesson`);
