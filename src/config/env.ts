import dotenv from "dotenv";

dotenv.config();

function getEnvVariable(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  graphqlPath: process.env.GRAPHQL_PATH ?? "/graphql",
  databaseUrl: getEnvVariable("DATABASE_URL"),
  clientId: getEnvVariable("CLIENT_ID"),
  clientSecret: getEnvVariable("CLIENT_SECRET"),
};
