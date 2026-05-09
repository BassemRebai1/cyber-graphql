import { StudentLevel } from "@prisma/client";

import type { GraphQLContext } from "../../server.js";
import { notFoundError } from "../../utils/errors.js";
import { pubsub, SUBSCRIPTION_TOPICS } from "../../utils/pubsub.js";
import {
  requireSensitiveQueryAuth,
  requireMutationAuth,
} from "../auth/authorization.js";

type CreateStudentArgs = {
  input: {
    fullName: string;
    email: string;
    level: StudentLevel;
    interests: string[];
    teamId?: string | null;
  };
};

type UpdateStudentArgs = {
  id: string;
  input: {
    fullName?: string;
    email?: string;
    level?: StudentLevel;
    interests?: string[];
    teamId?: string | null;
  };
};

export const studentResolvers = {
  Query: {
    students: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      requireSensitiveQueryAuth(context);
      return context.prisma.student.findMany({
        orderBy: { createdAt: "desc" },
      });
    },
    student: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      requireSensitiveQueryAuth(context);
      const student = await context.prisma.student.findUnique({
        where: { id: args.id },
      });

      if (!student) {
        notFoundError("Student");
      }

      return student;
    },
  },
  Mutation: {
    createStudent: async (
      _parent: unknown,
      args: CreateStudentArgs,
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const { teamId, ...input } = args.input;

      const student = await context.prisma.student.create({
        data: {
          ...input,
          team: teamId ? { connect: { id: teamId } } : undefined,
        },
      });

      await pubsub.publish(SUBSCRIPTION_TOPICS.studentCreated, {
        studentCreated: student,
      });

      return student;
    },
    updateStudent: async (
      _parent: unknown,
      args: UpdateStudentArgs,
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const existingStudent = await context.prisma.student.findUnique({
        where: { id: args.id },
      });

      if (!existingStudent) {
        notFoundError("Student");
      }

      const { teamId, ...input } = args.input;

      return context.prisma.student.update({
        where: { id: args.id },
        data: {
          ...input,
          team:
            teamId === undefined
              ? undefined
              : teamId
                ? { connect: { id: teamId } }
                : { disconnect: true },
        },
      });
    },
    deleteStudent: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const existingStudent = await context.prisma.student.findUnique({
        where: { id: args.id },
      });

      if (!existingStudent) {
        notFoundError("Student");
      }

      return context.prisma.student.delete({
        where: { id: args.id },
      });
    },
  },
  Student: {
    team: (
      parent: { teamId: string | null },
      _args: unknown,
      context: GraphQLContext,
    ) => {
      if (!parent.teamId) {
        return null;
      }

      // DataLoader batches team resolution for all students returned together.
      return context.loaders.teamById.load(parent.teamId);
    },
    writeups: (
      parent: { id: string },
      _args: unknown,
      context: GraphQLContext,
    ) =>
      // This avoids the classic N+1 pattern when a student list requests writeups.
      context.loaders.writeupsByAuthorId.load(parent.id),
  },
};
