import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export const SUBSCRIPTION_TOPICS = {
  studentCreated: "STUDENT_CREATED",
  eventCreated: "EVENT_CREATED",
  challengeCreated: "CHALLENGE_CREATED",
  resourceCreated: "RESOURCE_CREATED",
  writeupCreated: "WRITEUP_CREATED",
} as const;
