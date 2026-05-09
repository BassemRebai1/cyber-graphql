import gql from "graphql-tag";

export const rootTypeDefs = gql`
  type Query {
    students: [Student!]!
    student(id: ID!): Student!
    teams: [Team!]!
    team(id: ID!): Team!
    events: [CyberEvent!]!
    event(id: ID!): CyberEvent!
    challenges(input: ChallengeQueryInput): ChallengeConnection!
    challenge(id: ID!): Challenge!
    resources(input: ResourceQueryInput): LearningResourceConnection!
    resourcesByCategory(category: CyberCategory!): [LearningResource!]!
  }

  type Mutation {
    createStudent(input: CreateStudentInput!): Student!
    updateStudent(id: ID!, input: UpdateStudentInput!): Student!
    deleteStudent(id: ID!): Student!

    createTeam(input: CreateTeamInput!): Team!
    addStudentToTeam(studentId: ID!, teamId: ID!): Team!

    createEvent(input: CreateCyberEventInput!): CyberEvent!
    updateEvent(id: ID!, input: UpdateCyberEventInput!): CyberEvent!
    deleteEvent(id: ID!): CyberEvent!

    createChallenge(input: CreateChallengeInput!): Challenge!
    updateChallenge(id: ID!, input: UpdateChallengeInput!): Challenge!
    deleteChallenge(id: ID!): Challenge!

    createWriteup(input: CreateWriteupInput!): Writeup!

    createResource(input: CreateLearningResourceInput!): LearningResource!
    updateResource(
      id: ID!
      input: UpdateLearningResourceInput!
    ): LearningResource!
    deleteResource(id: ID!): LearningResource!
  }

  type Subscription {
    studentCreated: Student!
    eventCreated: CyberEvent!
    challengeCreated: Challenge!
    resourceCreated: LearningResource!
    writeupCreated: Writeup!
  }
`;
