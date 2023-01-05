/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `LessonCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LessonCategory_slug_key` ON `LessonCategory`(`slug`);
