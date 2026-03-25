import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Subject {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    image: String
    subjects: [Subject]
  }

  type Query {
    users: [User]
    subjects: [Subject]
    userById(id: ID!): User
  }

  type Mutation {
    newUser(
      name: String!
      email: String!
      password: String!
      image: String
      subjects: [ID]
    ): User
    deleteUser(id: ID!): User
    updateUser(
      id: ID!
      name: String
      email: String
      password: String
      image: String
      subjects: [ID]
    ): User
      newSubject(name: String!): Subject
      deleteSubject(id: ID!): Subject
      editSubject(id: ID!, name: String!): Subject
  }
`;
