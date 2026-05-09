import DataLoader from "dataloader";
import type {
  Challenge,
  CyberEvent,
  PrismaClient,
  Student,
  Team,
  Writeup,
} from "@prisma/client";

type Nullable<T> = T | null;

/**
 * Reorders one-to-one query results to match the exact key order requested
 * by DataLoader. This matters because a SQL query using `IN (...)` does not
 * guarantee the same ordering as the array of requested keys.
 */
function mapOneToOne<TKey extends string, TValue extends { id: string }>(
  keys: readonly TKey[],
  values: TValue[],
): Array<Nullable<TValue>> {
  const valueMap = new Map(values.map((value) => [value.id, value]));
  return keys.map((key) => valueMap.get(key) ?? null);
}

/**
 * Rebuilds grouped arrays for one-to-many relations such as:
 * - Team -> Students[]
 * - Challenge -> Writeups[]
 */
function mapOneToMany<TKey extends string, TValue>(
  keys: readonly TKey[],
  values: TValue[],
  getKey: (value: TValue) => TKey | null,
): TValue[][] {
  const groupedValues = new Map<TKey, TValue[]>();

  for (const value of values) {
    const key = getKey(value);

    if (!key) {
      continue;
    }

    const bucket = groupedValues.get(key);

    if (bucket) {
      bucket.push(value);
    } else {
      groupedValues.set(key, [value]);
    }
  }

  return keys.map((key) => groupedValues.get(key) ?? []);
}

/**
 * Creates request-scoped DataLoaders.
 *
 * Why request-scoped?
 * A loader caches values for a single GraphQL request/subscription execution.
 * This prevents leaking stale data across users while still batching repeated
 * relation lookups triggered by nested resolvers.
 */
export function createLoaders(prisma: PrismaClient) {
  return {
    // Used by `Student.team`.
    teamById: new DataLoader<string, Nullable<Team>>(async (teamIds) => {
      const teams = await prisma.team.findMany({
        where: {
          id: { in: [...teamIds] },
        },
      });

      return mapOneToOne(teamIds, teams);
    }),

    // Used by `Writeup.author`.
    studentById: new DataLoader<string, Nullable<Student>>(
      async (studentIds) => {
        const students = await prisma.student.findMany({
          where: {
            id: { in: [...studentIds] },
          },
        });

        return mapOneToOne(studentIds, students);
      },
    ),

    // Used by `Writeup.challenge`.
    challengeById: new DataLoader<string, Nullable<Challenge>>(
      async (challengeIds) => {
        const challenges = await prisma.challenge.findMany({
          where: {
            id: { in: [...challengeIds] },
          },
        });

        return mapOneToOne(challengeIds, challenges);
      },
    ),

    // Used by `Team.members`.
    studentsByTeamId: new DataLoader<string, Student[]>(async (teamIds) => {
      const students = await prisma.student.findMany({
        where: {
          teamId: { in: [...teamIds] },
        },
        orderBy: { fullName: "asc" },
      });

      return mapOneToMany(teamIds, students, (student) => student.teamId);
    }),

    // Used by `CyberEvent.challenges`.
    challengesByEventId: new DataLoader<string, Challenge[]>(
      async (eventIds) => {
        const challenges = await prisma.challenge.findMany({
          where: {
            eventId: { in: [...eventIds] },
          },
          orderBy: [{ points: "desc" }, { title: "asc" }],
        });

        return mapOneToMany(
          eventIds,
          challenges,
          (challenge) => challenge.eventId,
        );
      },
    ),

    // Used by `Student.writeups`.
    writeupsByAuthorId: new DataLoader<string, Writeup[]>(async (authorIds) => {
      const writeups = await prisma.writeup.findMany({
        where: {
          authorId: { in: [...authorIds] },
        },
        orderBy: { createdAt: "desc" },
      });

      return mapOneToMany(authorIds, writeups, (writeup) => writeup.authorId);
    }),

    // Used by `Challenge.writeups`.
    writeupsByChallengeId: new DataLoader<string, Writeup[]>(
      async (challengeIds) => {
        const writeups = await prisma.writeup.findMany({
          where: {
            challengeId: { in: [...challengeIds] },
          },
          orderBy: { createdAt: "desc" },
        });

        return mapOneToMany(
          challengeIds,
          writeups,
          (writeup) => writeup.challengeId,
        );
      },
    ),

    // Used by `Challenge.event`.
    eventById: new DataLoader<string, Nullable<CyberEvent>>(
      async (eventIds) => {
        const events = await prisma.cyberEvent.findMany({
          where: {
            id: { in: [...eventIds] },
          },
        });

        return mapOneToOne(eventIds, events);
      },
    ),
  };
}

export type GraphQLLoaders = ReturnType<typeof createLoaders>;
