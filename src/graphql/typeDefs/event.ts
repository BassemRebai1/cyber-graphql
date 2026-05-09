import gql from "graphql-tag";

export const eventTypeDefs = gql`
  type CyberEvent {
    id: ID!
    title: String!
    description: String!
    location: String!
    startDate: DateTime!
    endDate: DateTime!
    type: EventType!
    challenges: [Challenge!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateCyberEventInput {
    title: String!
    description: String!
    location: String!
    startDate: DateTime!
    endDate: DateTime!
    type: EventType!
  }

  input UpdateCyberEventInput {
    title: String
    description: String
    location: String
    startDate: DateTime
    endDate: DateTime
    type: EventType
  }
`;
