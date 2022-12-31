/*
  Warnings:

  - You are about to alter the column `status` on the `Enrolment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Enrolment_status")`.
  - You are about to alter the column `day` on the `Lesson` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Lesson_day")`.
  - You are about to alter the column `type` on the `Lesson` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Lesson_type")`.
  - You are about to alter the column `status` on the `Lesson` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Lesson_status")`.

*/
-- AlterTable
ALTER TABLE `Enrolment` MODIFY `status` ENUM('ENROLED', 'PENDING', 'CANCELLED', 'PAID') NOT NULL;

-- AlterTable
ALTER TABLE `Lesson` MODIFY `day` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    MODIFY `type` ENUM('TERM', 'HOLIDAY', 'TRIAL', 'ONCE', 'OTHER') NOT NULL,
    MODIFY `status` ENUM('UPCOMING', 'CURRENT', 'CLOSED', 'FULL', 'ENROL', 'PREVIOUS') NOT NULL;
