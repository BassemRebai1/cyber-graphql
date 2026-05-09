import type { GraphQLContext } from "../../server.js";
import { notFoundError } from "../../utils/errors.js";
import { pubsub, SUBSCRIPTION_TOPICS } from "../../utils/pubsub.js";
import { requireMutationAuth } from "../auth/authorization.js";

export const eventResolvers = {
  Query: {
    events: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      context.prisma.cyberEvent.findMany({
        orderBy: { startDate: "asc" },
      }),
    event: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      const event = await context.prisma.cyberEvent.findUnique({
        where: { id: args.id },
      });

      if (!event) {
        notFoundError("CyberEvent");
      }

      return event;
    },
  },
  Mutation: {
    createEvent: async (
      _parent: unknown,
      args: {
        input: {
          title: string;
          description: string;
          location: string;
          startDate: string;
          endDate: string;
          type: "CTF" | "WORKSHOP" | "CONFERENCE" | "BOOTCAMP" | "MEETUP";
        };
      },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const event = await context.prisma.cyberEvent.create({
        data: {
          ...args.input,
          startDate: new Date(args.input.startDate),
          endDate: new Date(args.input.endDate),
        },
      });

      await pubsub.publish(SUBSCRIPTION_TOPICS.eventCreated, {
        eventCreated: event,
      });

      return event;
    },
    updateEvent: async (
      _parent: unknown,
      args: {
        id: string;
        input: Partial<{
          title: string;
          description: string;
          location: string;
          startDate: string;
          endDate: string;
          type: "CTF" | "WORKSHOP" | "CONFERENCE" | "BOOTCAMP" | "MEETUP";
        }>;
      },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const existingEvent = await context.prisma.cyberEvent.findUnique({
        where: { id: args.id },
      });

      if (!existingEvent) {
        notFoundError("CyberEvent");
      }

      return context.prisma.cyberEvent.update({
        where: { id: args.id },
        data: {
          ...args.input,
          startDate: args.input.startDate
            ? new Date(args.input.startDate)
            : undefined,
          endDate: args.input.endDate
            ? new Date(args.input.endDate)
            : undefined,
        },
      });
    },
    deleteEvent: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const existingEvent = await context.prisma.cyberEvent.findUnique({
        where: { id: args.id },
      });

      if (!existingEvent) {
        notFoundError("CyberEvent");
      }

      return context.prisma.cyberEvent.delete({
        where: { id: args.id },
      });
    },
  },
  CyberEvent: {
    challenges: (
      parent: { id: string },
      _args: unknown,
      context: GraphQLContext,
    ) => context.loaders.challengesByEventId.load(parent.id),
  },
};
