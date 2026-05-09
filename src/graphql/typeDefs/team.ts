import gql from "graphql-tag";

export const teamTypeDefs = gql`
  type Team {
    id: ID!
    name: String!
    description: String!
    members: [Student!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateTeamInput {
    name: String!
    description: String!
  }
`;
