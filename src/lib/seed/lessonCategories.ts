import { LessonCategoryCreateInput } from '.keystone/types'

export const lessonCategories: LessonCategoryCreateInput[] = [
  {
    name: 'The Old Church on The Hill - Drama Club',
    slug: 'drama-club',
    type: 'TERM',
    cost: '$15 per week',
    description: `Drama Club is an immersive acting experience designed to develop self-confidence and stage presence. Actors explore creativity and problem-solving whilst learning to work in an ensemble with others. In-class acting methodologies of Stanislavsky, Meyerhold and Lecoq are utilised, with a focus on play, miming, physical acting, characterisation, and improvisation.

Drama Club caters to students in Prep to Grade 5 (ages 5-12). These classes will have two performance opportunities each year, a mid-year showcase displaying group and individual performances and an end-of-year staged play.

Students enrolled from the beginning of the year will be cast in the lead roles depending on their suitability.`,
    length: 'Varies on age and class size',
  },
  {
    name: 'Drama Teens - Teen Theatre and Performance',
    slug: 'drama-teens',
    type: 'TERM',
    cost: '$15 per week',
    description: `Drama Teens is an immersive acting experience designed to develop self-confidence, and stage presence, exploring creativity and problem-solving whilst learning to work in an ensemble with other actors. Each term the students will explore the acting methodologies of Stanislavsky, Meyerhold and Lecoq through physical acting, characterization, mask work and improvisation.

    Drama Teens focuses on and explores script work and theatrical pieces from different performance idioms throughout history. Drama Teens caters to students in grades 6 – 9. 
    
    This group will have three performance opportunities each year, two mid-year showcases displaying group and individual performances and an end-of-year staged play.`,
    length: '1 hour per week',
  },
  {
    name: 'Advanced Actors',
    slug: 'advanced-actors',
    type: 'OTHER',
    cost: 'Varies',
    description: `Advanced actors – (Grades 10 to Adult) is a performance/ exam class for the more serious actors and students. This class works at developing audition techniques by exploring solo and small ensemble works for performance.`,
    length: 'Varies',
  },
  {
    name: 'Theatre Making Workshops',
    slug: 'theatre-making-workshops',
    type: 'HOLIDAY',
    cost: '$20 per session',
    description: `Theatre Making Workshops are a series of workshops designed to develop the skills of the young theatre maker. These workshops will focus on the skills of devising, script writing, directing, and producing. Students will work in small groups to create their own short theatrical works. These workshops are for students in grades 6 – 9.`,
  },
]
