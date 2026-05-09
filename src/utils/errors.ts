import { GraphQLError } from "graphql";

export function notFoundError(entityName: string): never {
  throw new GraphQLError(`${entityName} not found.`, {
    extensions: { code: "NOT_FOUND" },
  });
}

export function authenticationError(message: string): never {
  throw new GraphQLError(message, {
    extensions: { code: "UNAUTHENTICATED" },
  });
}

export function badRequestError(message: string): never {
  throw new GraphQLError(message, {
    extensions: { code: "BAD_USER_INPUT" },
  });
}
