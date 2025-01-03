-- AlterTable
ALTER TABLE "_LessonTerm_messages" ADD CONSTRAINT "_LessonTerm_messages_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_LessonTerm_messages_AB_unique";

-- AlterTable
ALTER TABLE "_Lesson_teachers" ADD CONSTRAINT "_Lesson_teachers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_Lesson_teachers_AB_unique";
