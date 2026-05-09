# Cybersecurity Learning Hub API

## 1. Presentation du projet

Cybersecurity Learning Hub est une API GraphQL complete dediee a un ecosysme d'apprentissage en cybersécurité. Le projet centralise la gestion des etudiants, equipes, evenements cyber, challenges CTF, writeups techniques et ressources pedagogiques.

## 2. Objectif academique

Ce mini-projet a ete concu pour illustrer un cas d'usage realiste de GraphQL dans un contexte universitaire. Il met en pratique la modelisation relationnelle, l'architecture modulaire, l'authentification par client credentials et les subscriptions temps reel.

## 3. Theme choisi

Le theme retenu est `Cybersecurity Learning Hub`.

## 4. Architecture du projet

```text
src/
  config/
  graphql/
    resolvers/
    subscriptions/
    typeDefs/
  modules/
    auth/
    challenges/
    events/
    resources/
    students/
    teams/
    writeups/
  prisma/
  utils/
  server.ts
  index.ts
prisma/
  schema.prisma
  seed.ts
docs/
  graphql-examples.md
  api-documentation.md
```

### Explication de l'architecture

- `src/server.ts` configure Apollo Server, Express, le contexte GraphQL et les WebSockets.
- `src/modules/*` regroupe la logique de resolvers par domaine fonctionnel.
- `src/graphql/typeDefs/*` separe les types GraphQL par entite.
- `src/graphql/subscriptions` contient les resolvers des subscriptions.
- `src/utils` centralise l'authentification, les erreurs, la pagination et le pub/sub.
- `prisma/schema.prisma` decrit le modele relationnel.
- `prisma/seed.ts` initialise la base avec des donnees realistes.

## 5. Modele de donnees

Entites principales :

- `Student`
- `Team`
- `CyberEvent`
- `Challenge`
- `Writeup`
- `LearningResource`

## 6. Relations entre les entites

- Une `Team` contient plusieurs `Student`.
- Un `Student` peut ecrire plusieurs `Writeup`.
- Un `Challenge` peut appartenir a un `CyberEvent`.
- Un `Challenge` peut contenir plusieurs `Writeup`.
- Une `LearningResource` est associee a une categorie cybersécurité.

## 7. Technologies utilisees

- Node.js
- TypeScript
- Apollo Server
- GraphQL
- Prisma ORM
- PostgreSQL
- Docker Compose
- WebSocket avec `graphql-ws`

## 8. Installation

```bash
npm install
```

## 9. Configuration .env

Copier `.env.example` vers `.env` puis ajuster les valeurs si besoin :

```env
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cybersecurity_learning_hub?schema=public"
CLIENT_ID=securinets-client
CLIENT_SECRET=super-secret-value
GRAPHQL_PATH=/graphql
```

## 10. Lancement avec Docker

```bash
docker compose up -d
```

## 11. Migration Prisma

```bash
npm run prisma:migrate
```

## 12. Seed de la base

```bash
npm run prisma:seed
```

Le seed ajoute :

- 10 etudiants
- 3 equipes
- 5 evenements cyber
- 15 challenges CTF
- 10 writeups
- 20 ressources pedagogiques

### Comment la base de donnees a ete alimentee

Le remplissage a ete realise avec Prisma via le fichier [prisma/seed.ts](/home/bassem/graphql/prisma/seed.ts).

Principe utilise :

- suppression des donnees existantes dans l'ordre des dependances
- creation des equipes
- creation des etudiants en les rattachant a des equipes
- creation des evenements cyber
- creation des challenges avec ou sans rattachement a un evenement
- creation des writeups relies a un auteur et a un challenge
- creation des ressources pedagogiques

Pourquoi cet ordre :

- `Writeup` depend de `Student` et `Challenge`
- `Student` peut dependre de `Team`
- `Challenge` peut dependre de `CyberEvent`

Nature des donnees injectees :

- profils etudiants credibles avec niveaux et centres d'interet
- equipes a vocation offensive, defensive et forensic
- evenements academiques realistes
- challenges CTF classes par categorie, difficulte et points
- writeups techniques relies aux challenges
- ressources pedagogiques basees sur des references connues du domaine

Une explication detaillee est disponible dans [docs/database-seeding.md](docs/database-seeding.md).

## 13. Lancement du serveur

```bash
npm run dev
```

## 14. Acces a Apollo Studio / GraphQL Playground

Une fois le serveur lance, acceder a :

```text
http://localhost:4000/graphql
```

Apollo Sandbox permet de tester les queries, mutations et subscriptions.

## 15. Exemples de Queries

```graphql
query {
  challenges(input: { page: 1, pageSize: 5, sortByPoints: DESC }) {
    items {
      title
      points
      category
    }
  }
}
```

## 16. Exemples de Mutations

```graphql
mutation {
  createResource(
    input: {
      title: "Kubernetes Hardening Guide"
      description: "Bonnes pratiques de durcissement en environnement conteneurise."
      url: "https://kubernetes.io/docs/concepts/security/"
      category: CLOUD_SECURITY
      level: INTERMEDIATE
    }
  ) {
    id
    title
  }
}
```

## 17. Exemples de Subscriptions

```graphql
subscription {
  challengeCreated {
    id
    title
    points
  }
}
```

## 18. Explication de l'authentification

L'authentification repose sur deux headers :

- `x-client-id`
- `x-client-secret`

Les valeurs sont comparees a celles definies dans `.env`. Aucun secret n'est hardcode dans le code source.

### Regles appliquees

- les mutations exigent une authentification valide
- les subscriptions exigent une authentification valide
- les queries sensibles sur les etudiants et les equipes exigent une authentification valide
- les contenus publics tels que les evenements, challenges et ressources restent consultables sans authentification

## 19. Exemples de headers a envoyer

```http
x-client-id: securinets-client
x-client-secret: super-secret-value
```

Pour WebSocket :

```json
{
  "x-client-id": "securinets-client",
  "x-client-secret": "super-secret-value"
}
```

## 20. Fonctionnalites ajoutees

- Pagination sur les challenges et ressources
- Filtrage par categorie et difficulte
- Tri des challenges par points
- Documentation API detaillee
- Seed realiste pour la demonstration

## 21. Idees d'amelioration future

- ajouter des roles `admin`, `editor`, `viewer`
- implementer JWT ou OAuth2
- ajouter des tests unitaires et d'integration
- gerer les uploads de fichiers pour certains writeups
- introduire DataLoader pour optimiser certains acces relationnels
- ajouter des statistiques analytiques sur les challenges et la participation

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run prisma:migrate
npm run prisma:seed
npm run lint
npm run format
```

## Documentation complementaire

- [API documentation](docs/api-documentation.md)
- [GraphQL examples](docs/graphql-examples.md)
- [Database seeding](docs/database-seeding.md)
