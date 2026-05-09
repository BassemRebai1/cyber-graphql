import gql from "graphql-tag";

export const commonTypeDefs = gql`
  scalar DateTime

  enum StudentLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  enum CyberCategory {
    WEB_SECURITY
    CRYPTOGRAPHY
    FORENSICS
    REVERSE_ENGINEERING
    OSINT
    BLUE_TEAM
    CLOUD_SECURITY
    NETWORK_SECURITY
  }

  enum ChallengeDifficulty {
    EASY
    MEDIUM
    HARD
    INSANE
  }

  enum EventType {
    CTF
    WORKSHOP
    CONFERENCE
    BOOTCAMP
    MEETUP
  }

  enum ResourceLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  enum SortDirection {
    ASC
    DESC
  }

  type PaginationInfo {
    page: Int!
    pageSize: Int!
    totalItems: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`;
