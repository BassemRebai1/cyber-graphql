# Database Seeding

## Objectif

La base PostgreSQL a ete alimentee automatiquement avec Prisma afin d'obtenir un environnement de demonstration immediatement exploitable pour le projet universitaire.

## Fichier responsable

Le script utilise est :

- [prisma/seed.ts](/home/bassem/graphql/prisma/seed.ts)

## Commande d'execution

```bash
npm run prisma:seed
```

Cette commande lance :

```bash
npx prisma db seed
```

avec la configuration definie dans `package.json`.

## Strategie de remplissage

Le seed suit un ordre volontaire pour respecter les relations entre les tables :

1. suppression des anciennes donnees
2. creation des equipes
3. creation des etudiants
4. creation des evenements
5. creation des challenges
6. creation des writeups
7. creation des ressources pedagogiques

## Pourquoi cet ordre est important

- les `Student` peuvent referencer une `Team`
- les `Challenge` peuvent referencer un `CyberEvent`
- les `Writeup` referencent obligatoirement un `Student` et un `Challenge`

Si on insere les donnees dans le mauvais ordre, PostgreSQL rejettera certaines insertions a cause des cles etrangeres.

## Nettoyage avant insertion

Le script commence par supprimer les donnees existantes :

- `writeup`
- `student`
- `challenge`
- `cyberEvent`
- `team`
- `learningResource`

Ce nettoyage permet de rejouer le seed plusieurs fois avec un resultat coherent pour une demonstration.

## Donnees injectees

Le seed cree :

- 3 equipes
- 10 etudiants
- 5 evenements cyber
- 15 challenges CTF
- 10 writeups
- 20 ressources pedagogiques

## Nature des donnees

Les donnees ont ete choisies pour etre credibles dans un contexte cybersécurité :

- categories techniques realistes comme `WEB_SECURITY`, `OSINT`, `FORENSICS` et `CLOUD_SECURITY`
- niveaux differencies pour les etudiants et les ressources
- evenements de type `CTF`, `WORKSHOP`, `BOOTCAMP`, `MEETUP` et `CONFERENCE`
- challenges notes en points et classes par difficulte
- writeups relies a de vrais scenarios pedagogiques

## Exemple de logique d'alimentation

Exemple simplifie :

```ts
const teams = await Promise.all([
  prisma.team.create({ data: { name: "SecuriNinjas", description: "..." } }),
  prisma.team.create({
    data: { name: "BlueOps Defenders", description: "..." },
  }),
]);

await prisma.student.create({
  data: {
    fullName: "Amina Ben Salem",
    email: "amina.bensalem@cyberhub.tn",
    level: StudentLevel.INTERMEDIATE,
    interests: ["Web Security", "OSINT"],
    teamId: teams[0].id,
  },
});
```

Dans cet exemple, l'etudiant est cree apres l'equipe, puis lie a cette equipe via `teamId`.

## Ce qu'il faut dire en soutenance

- la base n'a pas ete remplie manuellement
- elle a ete alimentee automatiquement par un script Prisma de seed
- le seed respecte les dependances relationnelles entre les entites
- les donnees ont ete pensees pour simuler une vraie plateforme d'apprentissage cybersécurité
- cela facilite les tests, la demonstration et la reproductibilite du projet
