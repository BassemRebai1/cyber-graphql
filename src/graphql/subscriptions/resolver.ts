import type { GraphQLContext } from "../../server.js";
import { requireAuth } from "../../utils/auth.js";
import { pubsub, SUBSCRIPTION_TOPICS } from "../../utils/pubsub.js";

/**
 * Builds a protected async iterator for a subscription topic.
 * The actual list of subscribed clients is managed internally by graphql-ws
 * and PubSub; this helper simply ensures that only authenticated clients
 * can attach to a real-time channel.
 */
function protectedAsyncIterator<TTopic extends string>(
  topic: TTopic,
  context: GraphQLContext,
) {
  requireAuth(
    context.auth,
    "Subscriptions require valid x-client-id and x-client-secret credentials.",
  );

  return pubsub.asyncIterator(topic);
}

export const subscriptionResolvers = {
  Subscription: {
    studentCreated: {
      subscribe: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
        protectedAsyncIterator(SUBSCRIPTION_TOPICS.studentCreated, context),
    },
    eventCreated: {
      subscribe: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
        protectedAsyncIterator(SUBSCRIPTION_TOPICS.eventCreated, context),
    },
    challengeCreated: {
      subscribe: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
        protectedAsyncIterator(SUBSCRIPTION_TOPICS.challengeCreated, context),
    },
    resourceCreated: {
      subscribe: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
        protectedAsyncIterator(SUBSCRIPTION_TOPICS.resourceCreated, context),
    },
    writeupCreated: {
      subscribe: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
        protectedAsyncIterator(SUBSCRIPTION_TOPICS.writeupCreated, context),
    },
  },
};
