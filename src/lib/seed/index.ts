import { keystoneContext } from 'keystone/context'
import { lessonCategories } from 'lib/seed/lessonCategories'

export async function seedDatabase() {
  const context = keystoneContext.sudo()

  try {
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
      // Create lessons
    }
    return seed
  } catch (e) {
    throw new Error(e as string)
  }
}
