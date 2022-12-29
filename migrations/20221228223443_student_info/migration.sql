/*
  Warnings:

  - You are about to drop the column `maximumAge` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `minimumAge` on the `Class` table. All the data in the column will be lost.
  - Made the column `postcode` on table `Account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Bill` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `maximumYear` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimumYear` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Made the column `day` on table `Class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Class` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Enrolment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `school` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearLevel` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `dateOfBirth` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Account` MODIFY `postcode` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Bill` MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Class` DROP COLUMN `maximumAge`,
    DROP COLUMN `minimumAge`,
    ADD COLUMN `maximumYear` INTEGER NOT NULL,
    ADD COLUMN `minimumYear` INTEGER NOT NULL,
    MODIFY `day` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Enrolment` MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `medical` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `school` VARCHAR(191) NOT NULL,
    ADD COLUMN `yearLevel` INTEGER NOT NULL,
    MODIFY `dateOfBirth` DATE NOT NULL;
