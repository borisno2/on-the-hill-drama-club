/*
  Warnings:

  - You are about to drop the column `lesson` on the `Enrolment` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `lengthMin` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Made the column `cost` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Enrolment_lesson_idx` ON `Enrolment`;

-- AlterTable
ALTER TABLE `Enrolment` DROP COLUMN `lesson`,
    ADD COLUMN `lessonTerm` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Lesson` DROP COLUMN `endDate`,
    DROP COLUMN `quantity`,
    DROP COLUMN `startDate`,
    DROP COLUMN `status`,
    DROP COLUMN `type`,
    ADD COLUMN `lengthMin` INTEGER NOT NULL,
    ADD COLUMN `lessonCategory` VARCHAR(191) NULL,
    MODIFY `cost` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `LessonCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `cost` VARCHAR(191) NOT NULL DEFAULT '',
    `type` VARCHAR(191) NOT NULL,
    `length` VARCHAR(191) NOT NULL DEFAULT '',
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImportantDate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `date` DATE NOT NULL,
    `brief` VARCHAR(191) NOT NULL DEFAULT '',
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Term` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `quantity` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonTerm` (
    `id` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL,
    `term` VARCHAR(191) NULL,
    `lesson` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LessonTerm_term_idx`(`term`),
    INDEX `LessonTerm_lesson_idx`(`lesson`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Enrolment_lessonTerm_idx` ON `Enrolment`(`lessonTerm`);

-- CreateIndex
CREATE INDEX `Lesson_lessonCategory_idx` ON `Lesson`(`lessonCategory`);
