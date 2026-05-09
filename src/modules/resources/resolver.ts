import { CyberCategory, ResourceLevel, type Prisma } from "@prisma/client";

import type { GraphQLContext } from "../../server.js";
import { notFoundError } from "../../utils/errors.js";
import {
  buildPaginationMeta,
  normalizePagination,
} from "../../utils/pagination.js";
import { pubsub, SUBSCRIPTION_TOPICS } from "../../utils/pubsub.js";
import { requireMutationAuth } from "../auth/authorization.js";

export const resourceResolvers = {
  Query: {
    resources: async (
      _parent: unknown,
      args: {
        input?: {
          category?: CyberCategory | null;
          page?: number | null;
          pageSize?: number | null;
        } | null;
      },
      context: GraphQLContext,
    ) => {
      // We reuse the same pagination helper as other list endpoints to keep
      // page-based navigation consistent across the API.
      const { page, pageSize, skip, take } = normalizePagination(args.input);
      const where: Prisma.LearningResourceWhereInput = {
        category: args.input?.category ?? undefined,
      };

      // Both queries are needed: one for the current slice, one for metadata.
      const [items, totalItems] = await Promise.all([
        context.prisma.learningResource.findMany({
          where,
          skip,
          take,
          orderBy: [{ createdAt: "desc" }, { title: "asc" }],
        }),
        context.prisma.learningResource.count({ where }),
      ]);

      return {
        items,
        pageInfo: buildPaginationMeta(totalItems, page, pageSize),
      };
    },
    resourcesByCategory: (
      _parent: unknown,
      args: { category: CyberCategory },
      context: GraphQLContext,
    ) =>
      context.prisma.learningResource.findMany({
        where: { category: args.category },
        orderBy: { title: "asc" },
      }),
  },
  Mutation: {
    createResource: async (
      _parent: unknown,
      args: {
        input: {
          title: string;
          description: string;
          url: string;
          category: CyberCategory;
          level: ResourceLevel;
        };
      },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);

      // Publishing here enables real-time refresh on subscribed clients.
      const resource = await context.prisma.learningResource.create({
        data: args.input,
      });

      await pubsub.publish(SUBSCRIPTION_TOPICS.resourceCreated, {
        resourceCreated: resource,
      });

      return resource;
    },
    updateResource: async (
      _parent: unknown,
      args: {
        id: string;
        input: {
          title?: string;
          description?: string;
          url?: string;
          category?: CyberCategory;
          level?: ResourceLevel;
        };
      },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const existingResource = await context.prisma.learningResource.findUnique(
        {
          where: { id: args.id },
        },
      );

      if (!existingResource) {
        notFoundError("LearningResource");
      }

      return context.prisma.learningResource.update({
        where: { id: args.id },
        data: args.input,
      });
    },
    deleteResource: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      requireMutationAuth(context);
      const existingResource = await context.prisma.learningResource.findUnique(
        {
          where: { id: args.id },
        },
      );

      if (!existingResource) {
        notFoundError("LearningResource");
      }

      return context.prisma.learningResource.delete({
        where: { id: args.id },
      });
    },
  },
};
