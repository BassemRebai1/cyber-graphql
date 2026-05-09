import http from "http";
import { resolve } from "path";
import { pathToFileURL } from "url";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

import { env } from "./config/env.js";
import { createLoaders, type GraphQLLoaders } from "./graphql/loaders.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/typeDefs/index.js";
import { prisma } from "./prisma/client.js";
import {
  authenticateHeaders,
  requireAuth,
  type AuthStatus,
} from "./utils/auth.js";

export type GraphQLContext = {
  prisma: typeof prisma;
  auth: AuthStatus;
  loaders: GraphQLLoaders;
};

/**
 * Minimal shape used by graphql-ws to expose connection parameters.
 * We only need the credentials sent by the client during the WebSocket
 * handshake in order to protect subscriptions.
 */
type GraphQLWsContextShape = {
  connectionParams?: Record<string, unknown>;
};

/**
 * Creates the HTTP and WebSocket GraphQL servers.
 *
 * Architecture choice:
 * - Express handles HTTP requests and Apollo middleware
 * - Apollo Server executes queries and mutations
 * - graphql-ws handles subscriptions over WebSocket
 * - a shared Prisma client is injected into every resolver through context
 */
async function createApolloServer() {
  const { useServer } = (await import(
    pathToFileURL(
      resolve(process.cwd(), "node_modules/graphql-ws/lib/use/ws.js"),
    ).href
  )) as {
    useServer: (
      options: Record<string, unknown>,
      wsServer: WebSocketServer,
    ) => { dispose: () => Promise<void> };
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: env.graphqlPath,
  });

  const wsCleanup = useServer(
    {
      schema,
      context: async (ctx: GraphQLWsContextShape) => {
        // Subscriptions are authenticated once at connection time.
        const auth = authenticateHeaders(
          (ctx.connectionParams ?? {}) as Record<string, unknown>,
        );
        requireAuth(
          auth,
          "Subscriptions require valid x-client-id and x-client-secret credentials in connectionParams.",
        );

        return {
          prisma,
          auth,
          loaders: createLoaders(prisma),
        };
      },
    },
    wsServer,
  );

  const server = new ApolloServer<GraphQLContext>({
    schema,
    introspection: true,
    formatError: (formattedError) => formattedError,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(cors<cors.CorsRequest>());
  app.use(express.json());

  app.use(
    env.graphqlPath,
    expressMiddleware(server, {
      // HTTP requests are authenticated per request so queries and mutations
      // can decide whether the operation is public or protected.
      context: async ({ req }) => ({
        prisma,
        auth: authenticateHeaders(req.headers),
        loaders: createLoaders(prisma),
      }),
    }),
  );

  return { app, httpServer };
}

/**
 * Boots the API and exposes the HTTP and WebSocket endpoints.
 */
export async function startServer(): Promise<void> {
  const { httpServer } = await createApolloServer();

  await new Promise<void>((resolve) => {
    httpServer.listen(env.port, resolve);
  });

  console.log(
    `Cybersecurity Learning Hub GraphQL API running at http://localhost:${env.port}${env.graphqlPath}`,
  );
  console.log(
    `GraphQL subscriptions ready at ws://localhost:${env.port}${env.graphqlPath}`,
  );
}
