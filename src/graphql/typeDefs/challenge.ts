import gql from "graphql-tag";

export const challengeTypeDefs = gql`
  type Challenge {
    id: ID!
    title: String!
    description: String!
    category: CyberCategory!
    difficulty: ChallengeDifficulty!
    points: Int!
    eventId: ID
    event: CyberEvent
    writeups: [Writeup!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input ChallengePaginationInput {
    page: Int = 1
    pageSize: Int = 10
  }

  input ChallengeQueryInput {
    category: CyberCategory
    difficulty: ChallengeDifficulty
    page: Int = 1
    pageSize: Int = 10
    sortByPoints: SortDirection = DESC
  }

  input CreateChallengeInput {
    title: String!
    description: String!
    category: CyberCategory!
    difficulty: ChallengeDifficulty!
    points: Int!
    eventId: ID
  }

  input UpdateChallengeInput {
    title: String
    description: String
    category: CyberCategory
    difficulty: ChallengeDifficulty
    points: Int
    eventId: ID
  }

  type ChallengeConnection {
    items: [Challenge!]!
    pageInfo: PaginationInfo!
  }
`;
