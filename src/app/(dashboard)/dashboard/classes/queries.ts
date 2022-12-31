import { gql } from '@ts-gql/tag/no-transform'

export const GET_CLASSES = gql`
  query GET_CLASSES($where: ClassWhereInput) {
    classes(where: $where) {
      id
      name
      maxYear
      minYear
      status
      startDate
      endDate
      day
      time
      cost
      type
      location
      quantity
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_CLASSES').type

export const GET_CLASS_BY_ID = gql`
  query GET_CLASS_BY_ID($id: ID!) {
    class(where: { id: $id }) {
      id
      name
      description
      maxYear
      minYear
      status
      startDate
      endDate
      day
      time
      cost
      type
      location
      quantity
    }
  }
` as import('../../../../../__generated__/ts-gql/GET_CLASS_BY_ID').type
