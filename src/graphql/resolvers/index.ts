import { DateTimeResolver } from "graphql-scalars";

import { challengeResolvers } from "../../modules/challenges/resolver.js";
import { eventResolvers } from "../../modules/events/resolver.js";
import { resourceResolvers } from "../../modules/resources/resolver.js";
import { studentResolvers } from "../../modules/students/resolver.js";
import { teamResolvers } from "../../modules/teams/resolver.js";
import { writeupResolvers } from "../../modules/writeups/resolver.js";
import { subscriptionResolvers } from "../subscriptions/resolver.js";

/**
 * Apollo merges this array into one executable resolver map.
 * The split by domain keeps each module focused on its own business area.
 */
export const resolvers = [
  {
    DateTime: DateTimeResolver,
  },
  studentResolvers,
  teamResolvers,
  eventResolvers,
  challengeResolvers,
  writeupResolvers,
  resourceResolvers,
  subscriptionResolvers,
];
