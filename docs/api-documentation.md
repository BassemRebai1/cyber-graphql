# API Documentation

## Overview

Cybersecurity Learning Hub expose une API GraphQL construite avec Apollo Server, Prisma et PostgreSQL. Elle centralise la gestion des etudiants, equipes, evenements, challenges CTF, writeups et ressources pedagogiques.

## Authentication

L'API utilise une authentification simple par client credentials. Les credentials sont lus depuis les variables d'environnement `CLIENT_ID` et `CLIENT_SECRET`.

Headers HTTP requis pour les mutations et les queries sensibles :

```http
x-client-id: securinets-client
x-client-secret: super-secret-value
```

Pour les subscriptions WebSocket, les credentials doivent etre envoyes dans `connectionParams`.

## Protected Operations

Operations protegees :

- `students`
- `student`
- `teams`
- `team`
- toutes les mutations
- toutes les subscriptions

Operations publiques :

- `events`
- `event`
- `challenges`
- `challenge`
- `resources`
- `resourcesByCategory`

## GraphQL Capabilities

### Queries

- lecture complete des etudiants et equipes
- consultation des evenements et de leurs challenges
- recuperation des challenges avec pagination, filtrage et tri
- recuperation des ressources avec pagination et filtrage

### Mutations

- CRUD des etudiants
- creation d'equipe et ajout d'un membre
- CRUD des evenements
- CRUD des challenges
- creation de writeup
- CRUD des ressources pedagogiques

### Subscriptions

- `studentCreated`
- `eventCreated`
- `challengeCreated`
- `resourceCreated`
- `writeupCreated`

## Pagination

Les queries `challenges` et `resources` renvoient un objet de type connection :

```graphql
type ChallengeConnection {
  items: [Challenge!]!
  pageInfo: PaginationInfo!
}
```

Le type `PaginationInfo` fournit :

- `page`
- `pageSize`
- `totalItems`
- `totalPages`
- `hasNextPage`
- `hasPreviousPage`

## Filtering And Sorting

### Challenges

- filtre par `category`
- filtre par `difficulty`
- tri par `points` via `sortByPoints`

### Resources

- filtre par `category`

## Error Handling

L'API renvoie des erreurs GraphQL explicites avec les codes suivants :

- `UNAUTHENTICATED`
- `NOT_FOUND`
- `BAD_USER_INPUT`

## Real-Time Flow

Lorsqu'une mutation de creation reussit, le resolver publie automatiquement un evenement via `PubSub`. Les clients abonnes recoivent la nouvelle donnee en temps reel via WebSocket.
