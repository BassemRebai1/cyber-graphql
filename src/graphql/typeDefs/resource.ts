import gql from "graphql-tag";

export const resourceTypeDefs = gql`
  type LearningResource {
    id: ID!
    title: String!
    description: String!
    url: String!
    category: CyberCategory!
    level: ResourceLevel!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input ResourceQueryInput {
    category: CyberCategory
    page: Int = 1
    pageSize: Int = 10
  }

  input CreateLearningResourceInput {
    title: String!
    description: String!
    url: String!
    category: CyberCategory!
    level: ResourceLevel!
  }

  input UpdateLearningResourceInput {
    title: String
    description: String
    url: String
    category: CyberCategory
    level: ResourceLevel
  }

  type LearningResourceConnection {
    items: [LearningResource!]!
    pageInfo: PaginationInfo!
  }
`;
