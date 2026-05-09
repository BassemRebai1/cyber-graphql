import gql from "graphql-tag";

export const writeupTypeDefs = gql`
  type Writeup {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    challengeId: ID!
    author: Student!
    challenge: Challenge!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateWriteupInput {
    title: String!
    content: String!
    authorId: ID!
    challengeId: ID!
  }
`;
