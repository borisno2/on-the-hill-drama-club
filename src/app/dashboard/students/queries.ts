import { gql } from '@ts-gql/tag/no-transform'

export const GET_STUDENTS = gql`
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
` as import('../../../../__generated__/ts-gql/GET_STUDENTS').type

export const GET_STUDENT_BY_ID_WITH_ENROLMENTS = gql`
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
` as import('../../../../__generated__/ts-gql/GET_STUDENT_BY_ID_WITH_ENROLMENTS').type

export const GET_STUDENT_BY_ID = gql`
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
` as import('../../../../__generated__/ts-gql/GET_STUDENT_BY_ID').type

export const ENROL_STUDENT_IN_LESSON = gql`
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
` as import('../../../../__generated__/ts-gql/ENROL_STUDENT_IN_LESSON').type

export const GET_ENROLMENT_BY_ID = gql`
  query GET_ENROLMENT_BY_ID($id: ID!) {
    enrolment(where: { id: $id }) {
      id
      status
      createdAt
      student {
        id
        firstName
        surname
        account {
          id
          firstName
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
` as import('../../../../__generated__/ts-gql/GET_ENROLMENT_BY_ID').type
