/*
  Warnings:

  - Added the required column `numberOfLessons` to the `LessonTerm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LessonTerm` ADD COLUMN `numberOfLessons` INTEGER NOT NULL;
