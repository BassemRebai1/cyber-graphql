import type { GraphQLContext } from "../../server.js";
import { requireAuth } from "../../utils/auth.js";

/**
 * Sensitive queries expose student and team information.
 * They require valid client credentials even though some
 * read-only content remains public for the course demo.
 */
export function requireSensitiveQueryAuth(context: GraphQLContext): void {
  requireAuth(
    context.auth,
    "This query is protected. Provide valid x-client-id and x-client-secret headers.",
  );
}

/**
 * All write operations are protected so only authenticated clients can
 * create, update or delete data in the learning hub.
 */
export function requireMutationAuth(context: GraphQLContext): void {
  requireAuth(
    context.auth,
    "Mutations require valid x-client-id and x-client-secret headers.",
  );
}
