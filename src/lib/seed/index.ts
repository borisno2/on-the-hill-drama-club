import { keystoneContext } from 'keystone/context'
import { lessonCategories } from 'lib/seed/lessonCategories'
import { teachersSeed } from './teachers'
import { lessons } from './lessons'

export async function seedDatabase() {
  const context = keystoneContext.sudo()

  try {
    const emailSettings = await context.db.EmailSettings.findOne({})
    if (!emailSettings) {
      await context.db.EmailSettings.createOne({
        data: {
          fromEmail: 'test@test.com',
          enrolmentConfirmationTemplate: 'd-123456',
        },
      })
    }
    // Check if any lesson categories exist
    const lessonCategoriesExist = await context.db.LessonCategory.count()
    let seed = 0
    if (lessonCategoriesExist === 0) {
      const seedLessonCategories = await context.db.LessonCategory.createMany({
        data: lessonCategories,
      })
      seed += seedLessonCategories.length
    }
    // Check if any lessons exist
    const lessonsExist = await context.db.Lesson.count()
    if (lessonsExist === 0) {
      const seedLessons = await context.db.Lesson.createMany({
        data: lessons,
      })
      seed += seedLessons.length
    }
    const teachersExist = await context.db.Teacher.count()
    if (teachersExist === 0) {
      const teachers = await context.db.Teacher.createMany({
        data: teachersSeed,
      })
      seed += teachers.length
    }
    return seed
  } catch (e) {
    throw new Error(e as string)
  }
}
