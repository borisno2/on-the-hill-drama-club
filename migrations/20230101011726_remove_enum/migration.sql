/*
  Warnings:

  - You are about to alter the column `day` on the `Lesson` table. The data in that column could be lost. The data in that column will be cast from `Enum("Lesson_day")` to `VarChar(191)`.
  - You are about to alter the column `type` on the `Lesson` table. The data in that column could be lost. The data in that column will be cast from `Enum("Lesson_type")` to `VarChar(191)`.
  - You are about to alter the column `status` on the `Lesson` table. The data in that column could be lost. The data in that column will be cast from `Enum("Lesson_status")` to `VarChar(191)`.
  - You are about to alter the column `school` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `Enum("Student_school")` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Lesson` MODIFY `day` VARCHAR(191) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Student` MODIFY `school` VARCHAR(191) NOT NULL;
