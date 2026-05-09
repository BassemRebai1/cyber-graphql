import {
  ChallengeDifficulty,
  CyberCategory,
  type Prisma,
} from "@prisma/client";

import type { GraphQLContext } from "../../server.js";
import {
  buildPaginationMeta,
  normalizePagination,
} from "../../utils/pagination.js";
import { notFoundError } from "../../utils/errors.js";
import { pubsub, SUBSCRIPTION_TOPICS } from "../../utils/pubsub.js";
import { requireMutationAuth } from "../auth/authorization.js";

type ChallengeQueryArgs = {
  input?: {
    category?: CyberCategory | null;
    difficulty?: ChallengeDifficulty | null;
    page?: number | null;
    pageSize?: number | null;
    sortByPoints?: "ASC" | "DESC" | null;
  } | null;
};

export const challengeResolvers = {
  Query: {
    challenges: async (
      _parent: unknown,
      args: ChallengeQueryArgs,
      context: GraphQLContext,
    ) => {
      // GraphQL exposes page/pageSize while Prisma expects skip/take.
      const { page, pageSize, skip, take } = normalizePagination(args.input);

      const where: Prisma.ChallengeWhereInput = {
        category: args.input?.category ?? undefined,
        difficulty: args.input?.difficulty ?? undefined,
      };

      // Run the page query and the total count in parallel so the API can
      // return both the items and pagination metadata efficiently.
      const [items, totalItems] = await Promise.all([
        context.prisma.challenge.findMany({
          where,
          skip,
          take,
          orderBy: [
            { points: args.input?.sortByPoints === "ASC" ? "asc" : "desc" },
            { title: "asc" },
          ],
        }),
        context.prisma.challenge.count({ where }),
      ]);

      return {
        items,
        pageInfo: buildPaginationMeta(totalItems, page, pageSize),
      };
    },
    challenge: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      const challenge = await context.prisma.challenge.findUnique({
        where: { id: args.id },
      });

      if (!challenge) {
        notFoundError("Challenge");
      }

      return challenge;
    },
  },
  Mutation: {
    createChallenge: async (
      _parent: unknown,
      args: {
        input: {
          title: string;
          description: string;
          category: CyberCategory;
          difficulty: ChallengeDifficulty;
          points: number;
          eventId?: string | null;
        };
      },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const { eventId, ...input } = args.input;

      // The event relation is optional, so it is only connected when present.
      const challenge = await context.prisma.challenge.create({
        data: {
          ...input,
          event: eventId ? { connect: { id: eventId } } : undefined,
        },
      });

      // Notify subscribed clients as soon as the challenge has been persisted.
      await pubsub.publish(SUBSCRIPTION_TOPICS.challengeCreated, {
        challengeCreated: challenge,
      });

      return challenge;
    },
    updateChallenge: async (
      _parent: unknown,
      args: {
        id: string;
        input: {
          title?: string;
          description?: string;
          category?: CyberCategory;
          difficulty?: ChallengeDifficulty;
          points?: number;
          eventId?: string | null;
        };
      },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const existingChallenge = await context.prisma.challenge.findUnique({
        where: { id: args.id },
      });

      if (!existingChallenge) {
        notFoundError("Challenge");
      }

      const { eventId, ...input } = args.input;

      return context.prisma.challenge.update({
        where: { id: args.id },
        data: {
          ...input,
          event:
            eventId === undefined
              ? undefined
              : eventId
                ? { connect: { id: eventId } }
                : { disconnect: true },
        },
      });
    },
    deleteChallenge: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const existingChallenge = await context.prisma.challenge.findUnique({
        where: { id: args.id },
      });

      if (!existingChallenge) {
        notFoundError("Challenge");
      }

      return context.prisma.challenge.delete({
        where: { id: args.id },
      });
    },
  },
  Challenge: {
    event: (
      parent: { eventId: string | null },
      _args: unknown,
      context: GraphQLContext,
    ) => {
      if (!parent.eventId) {
        return null;
      }

      // DataLoader batches all nested event lookups across the same request.
      return context.loaders.eventById.load(parent.eventId);
    },
    writeups: (
      parent: { id: string },
      _args: unknown,
      context: GraphQLContext,
    ) =>
      // DataLoader avoids one SQL query per challenge when writeups are requested.
      context.loaders.writeupsByChallengeId.load(parent.id),
  },
};
