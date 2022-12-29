/*
  Warnings:

  - You are about to alter the column `school` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("Student_school")`.

*/
-- AlterTable
ALTER TABLE `Student` MODIFY `medical` TEXT NULL,
    MODIFY `school` ENUM('SCHOOL', 'HOME', 'OTHER') NOT NULL;
