// graphql.js
import { gql } from '@apollo/client';


export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      image
      subjects {
        id
        name
      }
    }
  }
`;


export const GET_SUBJECTS = gql`
  query GetSubjects {
    subjects {
      id
      name
    }
  }
`;


export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    userById(id: $id) {
      id
      name
      email
      image
      subjects {
        id
        name
      }
    }
  }
`;


export const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $password: String!
    $image: String
    $subjects: [ID]
  ) {
    newUser(
      name: $name
      email: $email
      password: $password
      image: $image
      subjects: $subjects
    ) {
      id
      name
      email
      image
      subjects {
        id
        name
      }
    }
  }
`;


export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
      email
      image
    }
  }
`;

// Update a user
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $email: String
    $password: String
    $image: String
    $subjects: [ID]
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      password: $password
      image: $image
      subjects: $subjects
    ) {
      id
      name
      email
      image
      subjects {
        id
        name
      }
    }
  }
`;

// Add a subject
export const ADD_SUBJECT = gql`
  mutation AddSubject($name: String!) {
    newSubject(name: $name) {
      id
      name
    }
  }
`;

// Delete a subject
export const DELETE_SUBJECT = gql`
  mutation DeleteSubject($id: ID!) {
    deleteSubject(id: $id) {
      id
      name
    }
  }
`;
