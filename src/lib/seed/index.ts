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
    const termsExist = await context.db.Term.count()
    if (termsExist === 0) {
      const seedTerms = await context.db.Term.createMany({
        data: [
          {
            name: 'Term 1 2025',
            year: 2025,
            quantity: 10,
            startDate: '2025-01-01',
            endDate: '2025-03-31',
          },
        ],
      })
      seed += seedTerms.length
    }
    const lessonTermsExist = await context.db.LessonTerm.count()
    if (lessonTermsExist === 0) {
      const seedTerms = await context.db.Term.findMany()
      const lessons = await context.db.Lesson.findMany()
      const lessonTerms = await context.db.LessonTerm.createMany({
        data: seedTerms.flatMap((term) => {
          return lessons.map((lesson) => ({
            term: { connect: { id: term.id } },
            lesson: { connect: { id: lesson.id } },
            status: 'ENROL' as const,
          }))
        }),
      })
      seed += lessonTerms.length
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
