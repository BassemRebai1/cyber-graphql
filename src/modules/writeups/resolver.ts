import type { GraphQLContext } from "../../server.js";
import { notFoundError } from "../../utils/errors.js";
import { pubsub, SUBSCRIPTION_TOPICS } from "../../utils/pubsub.js";
import { requireMutationAuth } from "../auth/authorization.js";

export const writeupResolvers = {
  Mutation: {
    createWriteup: async (
      _parent: unknown,
      args: {
        input: {
          title: string;
          content: string;
          authorId: string;
          challengeId: string;
        };
      },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);

      const [student, challenge] = await Promise.all([
        context.prisma.student.findUnique({
          where: { id: args.input.authorId },
        }),
        context.prisma.challenge.findUnique({
          where: { id: args.input.challengeId },
        }),
      ]);

      if (!student) {
        notFoundError("Student");
      }

      if (!challenge) {
        notFoundError("Challenge");
      }

      const writeup = await context.prisma.writeup.create({
        data: args.input,
      });

      await pubsub.publish(SUBSCRIPTION_TOPICS.writeupCreated, {
        writeupCreated: writeup,
      });

      return writeup;
    },
  },
  Writeup: {
    author: async (
      parent: { authorId: string },
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const author = await context.loaders.studentById.load(parent.authorId);

      if (!author) {
        notFoundError("Student");
      }

      return author;
    },
    challenge: async (
      parent: { challengeId: string },
      _args: unknown,
      context: GraphQLContext,
    ) => {
      const challenge = await context.loaders.challengeById.load(
        parent.challengeId,
      );

      if (!challenge) {
        notFoundError("Challenge");
      }

      return challenge;
    },
  },
};
