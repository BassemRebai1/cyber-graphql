import gql from "graphql-tag";

export const studentTypeDefs = gql`
  type Student {
    id: ID!
    fullName: String!
    email: String!
    level: StudentLevel!
    interests: [String!]!
    teamId: ID
    team: Team
    writeups: [Writeup!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateStudentInput {
    fullName: String!
    email: String!
    level: StudentLevel!
    interests: [String!]!
    teamId: ID
  }

  input UpdateStudentInput {
    fullName: String
    email: String
    level: StudentLevel
    interests: [String!]
    teamId: ID
  }
`;
