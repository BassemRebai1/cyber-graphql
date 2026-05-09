import type { GraphQLContext } from "../../server.js";
import { notFoundError } from "../../utils/errors.js";
import {
  requireSensitiveQueryAuth,
  requireMutationAuth,
} from "../auth/authorization.js";

export const teamResolvers = {
  Query: {
    teams: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      requireSensitiveQueryAuth(context);
      return context.prisma.team.findMany({
        orderBy: { createdAt: "asc" },
      });
    },
    team: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      requireSensitiveQueryAuth(context);
      const team = await context.prisma.team.findUnique({
        where: { id: args.id },
      });

      if (!team) {
        notFoundError("Team");
      }

      return team;
    },
  },
  Mutation: {
    createTeam: async (
      _parent: unknown,
      args: { input: { name: string; description: string } },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      return context.prisma.team.create({
        data: args.input,
      });
    },
    addStudentToTeam: async (
      _parent: unknown,
      args: { studentId: string; teamId: string },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);

      const [student, team] = await Promise.all([
        context.prisma.student.findUnique({ where: { id: args.studentId } }),
        context.prisma.team.findUnique({ where: { id: args.teamId } }),
      ]);

      if (!student) {
        notFoundError("Student");
      }

      if (!team) {
        notFoundError("Team");
      }

      await context.prisma.student.update({
        where: { id: args.studentId },
        data: { teamId: args.teamId },
      });

      return context.prisma.team.findUniqueOrThrow({
        where: { id: args.teamId },
      });
    },
  },
  Team: {
    members: (
      parent: { id: string },
      _args: unknown,
      context: GraphQLContext,
    ) => context.loaders.studentsByTeamId.load(parent.id),
  },
};
