import type { IncomingHttpHeaders } from "http";

import { env } from "../config/env.js";
import { authenticationError } from "./errors.js";

export type AuthStatus = {
  isAuthenticated: boolean;
  clientId?: string;
};

type HeaderLike = IncomingHttpHeaders | Record<string, unknown> | undefined;

/**
 * Reads a header value from either Express headers or WebSocket connectionParams.
 * The helper centralises this logic so HTTP and subscription authentication use
 * the same credential extraction path.
 */
function extractHeaderValue(
  headers: HeaderLike,
  key: string,
): string | undefined {
  if (!headers) {
    return undefined;
  }

  const value = headers[key] ?? headers[key.toLowerCase()];

  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === "string" ? value : undefined;
}

/**
 * Validates the client credentials sent by the consumer.
 * No secret is stored in code: the expected values come from `.env`.
 */
export function authenticateHeaders(headers: HeaderLike): AuthStatus {
  const clientId = extractHeaderValue(headers, "x-client-id");
  const clientSecret = extractHeaderValue(headers, "x-client-secret");

  const isAuthenticated =
    clientId === env.clientId && clientSecret === env.clientSecret;

  return {
    isAuthenticated,
    clientId,
  };
}

/**
 * Throws a GraphQL authentication error when a protected operation
 * is accessed without valid credentials.
 */
export function requireAuth(auth: AuthStatus, message?: string): void {
  if (!auth.isAuthenticated) {
    authenticationError(
      message ??
        "Invalid or missing client credentials. Provide x-client-id and x-client-secret headers.",
    );
  }
}
