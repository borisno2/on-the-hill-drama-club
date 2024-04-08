import { graphql } from 'gql'

export const GET_STUDENTS = graphql(`
  query GET_STUDENTS {
    students {
      id
      firstName
      surname
      dateOfBirth
      yearLevel
      enrolmentsCount
    }
  }
`)

export const GET_STUDENT_BY_ID_WITH_ENROLMENTS = graphql(`
  query GET_STUDENT_BY_ID_WITH_ENROLMENTS($id: ID!) {
    student(where: { id: $id }) {
      id
      firstName
      surname
      dateOfBirth
      school
      yearLevel
      medical
      enrolments {
        id
        status
        createdAt
        lessonTerm {
          id
          name
          status
          term {
            id
            startDate
            endDate
          }
          lesson {
            id
            day
            time
            location
            lessonCategory {
              id
              cost
              type
            }
          }
        }
      }
    }
  }
`)

export const GET_STUDENT_BY_ID = graphql(`
  query GET_STUDENT_BY_ID($id: ID!) {
    student(where: { id: $id }) {
      id
      firstName
      surname
      dateOfBirth
      school
      yearLevel
      medical
    }
  }
`)

export const ENROL_STUDENT_IN_LESSON = graphql(`
  mutation ENROL_STUDENT_IN_LESSON($studentId: ID!, $lessonId: ID!) {
    updateStudent(
      where: { id: $studentId }
      data: {
        enrolments: {
          create: {
            status: "PENDING"
            lessonTerm: { connect: { id: $lessonId } }
          }
        }
      }
    ) {
      id
      name
      enrolments {
        id
        lessonTerm {
          id
        }
      }
    }
  }
`)

export const GET_ENROLMENT_BY_ID = graphql(`
  query GET_ENROLMENT_BY_ID($id: ID!) {
    enrolment(where: { id: $id }) {
      id
      status
      createdAt
      student {
        id
        name
        firstName
        surname
        account {
          id
          firstName
          name
          user {
            id
            email
          }
        }
      }
      lessonTerm {
        id
        name
        status
        numberOfLessons
        term {
          id
          name
          startDate
          endDate
        }
        lesson {
          id
          day
          time
          name
          location
          cost
        }
      }
    }
  }
`)
