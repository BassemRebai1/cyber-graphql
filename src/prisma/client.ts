import { PrismaClient } from "@prisma/client";

/**
 * Prisma client is shared across the application to avoid opening
 * too many database connections during development.
 */
export const prisma = new PrismaClient();
