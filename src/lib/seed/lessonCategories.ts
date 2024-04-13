import { LessonCategoryCreateInput } from '.keystone/types'

export const lessonCategories: LessonCategoryCreateInput[] = [
  {
    name: 'Private Music Tuition',
    slug: 'private-music-tuition',
    type: 'TERM',
    cost: 'Varies',
    description: `Emily offers private music lessons in Violin, Viola and Cello to students of all ages. 
    
These weekly one-on-one lessons cater to the student's individual learning style, specifically focusing on technical development, solo performance technique and repertoire development.
    
AMEB Examination preparation from preliminary – 8th grade is also available for students if desired.`,
    length: 'Varies on Student age and ability',
  },
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
    name: 'Only Strings - Orchestra',
    slug: 'only-strings-orchestra',
    type: 'TERM',
    cost: '$15 per week',
    description: `Ensemble playing is a fun, inclusive, and essential skill for a developing musician. Possessing the ability to play music in any group situation - orchestras, quartets, at church or with a piano accompaniment is a lifelong skill. 

"Only Strings" is a student training string ensemble suited for string players who have achieved AMEB grade 1 or higher. These group classes focus on developing ensemble skills, playing in time/together, following a conductor and learning to play musically in an ensemble. Music reading skills are essential.

Quartet lessons are available for more advanced students – AMEB grade 3 and above.`,
    length: '1 hour per week',
  },
  {
    name: 'Music Theory',
    slug: 'music-theory',
    type: 'TERM',
    cost: '$15 per week',
    description: `Music theory classes and written exams (AMEB grades 1 - 6) are specifically for students preparing for AMEB practical exams.

These classes develop and deepen the musical knowledge and understanding required for a well-rounded and advanced musician.

These classes are only run for the first six months of the year.`,
    length: '1 hour per week',
  },
  {
    name: 'Musical Munchkins - Early Childhood Music',
    slug: 'musical-munchkins',
    type: 'TERM',
    cost: '$10 per week',
    description: `Musical Munchkins is our early childhood music program. Early exposure to and exploration of music can help children to develop language skills, creativity, and long-lasting musical skills. With a fun program focusing on play, exploration of pitch, rhythm and physical movement, these classes are specifically designed to be an underpinning to further musical education.

Term 1 – Under the Sea
Term 2 – Feathers and Fur
Term 3 – Colours
Term 4 - Up in the Sky`,
    length: '30 minutes per week',
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
]
