# GraphQL Examples

## Headers

```http
x-client-id: securinets-client
x-client-secret: super-secret-value
```

## Query: all challenges

```graphql
query GetAllChallenges {
  challenges {
    items {
      id
      title
      category
      difficulty
      points
    }
    pageInfo {
      page
      pageSize
      totalItems
      totalPages
    }
  }
}
```

## Query: challenges with pagination

```graphql
query GetChallengesWithPagination {
  challenges(input: { page: 2, pageSize: 5 }) {
    items {
      title
      points
    }
    pageInfo {
      page
      pageSize
      hasNextPage
      hasPreviousPage
    }
  }
}
```

## Query: challenges filtered by category

```graphql
query GetWebChallenges {
  challenges(input: { category: WEB_SECURITY }) {
    items {
      title
      category
      difficulty
    }
  }
}
```

## Query: challenges sorted by points

```graphql
query GetChallengesSortedByPoints {
  challenges(input: { sortByPoints: DESC, page: 1, pageSize: 10 }) {
    items {
      title
      points
    }
  }
}
```

## Mutation: create a student

```graphql
mutation CreateStudent {
  createStudent(
    input: {
      fullName: "Nada Khelifi"
      email: "nada.khelifi@cyberhub.tn"
      level: INTERMEDIATE
      interests: ["Blue Team", "OSINT", "Python"]
    }
  ) {
    id
    fullName
    email
    level
  }
}
```

## Mutation: create a challenge

```graphql
mutation CreateChallenge {
  createChallenge(
    input: {
      title: "SSRF Pivot Lab"
      description: "Exploit a server-side request forgery in a cloud metadata endpoint."
      category: WEB_SECURITY
      difficulty: HARD
      points: 380
    }
  ) {
    id
    title
    points
  }
}
```

## Mutation: create a writeup

```graphql
mutation CreateWriteup {
  createWriteup(
    input: {
      title: "SSRF Pivot Lab writeup"
      content: "The metadata service was reachable through a vulnerable PDF preview endpoint..."
      authorId: "student-id"
      challengeId: "challenge-id"
    }
  ) {
    id
    title
    createdAt
  }
}
```

## Subscription: challengeCreated

```graphql
subscription OnChallengeCreated {
  challengeCreated {
    id
    title
    category
    points
  }
}
```

## Subscription: resourceCreated

```graphql
subscription OnResourceCreated {
  resourceCreated {
    id
    title
    category
    level
  }
}
```
