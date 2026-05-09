import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "../config/constants.js";

export type PaginationInput = {
  page?: number | null;
  pageSize?: number | null;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * Converts user input into safe Prisma pagination parameters.
 * This prevents invalid values such as negative pages and caps the page size.
 */
export function normalizePagination(input?: PaginationInput | null): {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
} {
  const page = Math.max(1, input?.page ?? 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, input?.pageSize ?? DEFAULT_PAGE_SIZE),
  );

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

/**
 * Builds a GraphQL-friendly pagination object returned by list queries.
 */
export function buildPaginationMeta(
  totalItems: number,
  page: number,
  pageSize: number,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
