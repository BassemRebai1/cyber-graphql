import {
  ChallengeDifficulty,
  CyberCategory,
  EventType,
  PrismaClient,
  ResourceLevel,
  StudentLevel,
} from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds the PostgreSQL database with realistic cybersecurity learning data.
 *
 * Insertion order matters because of foreign keys:
 * 1. delete child tables first
 * 2. create teams
 * 3. create students linked to teams
 * 4. create events
 * 5. create challenges, some linked to events
 * 6. create writeups linked to students and challenges
 * 7. create learning resources
 */
async function main() {
  // Cleanup starts from dependent tables to avoid foreign key violations.
  await prisma.writeup.deleteMany();
  await prisma.student.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.cyberEvent.deleteMany();
  await prisma.team.deleteMany();
  await prisma.learningResource.deleteMany();

  // Teams are inserted first because students may reference a teamId.
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "SecuriNinjas",
        description: "Equipe orientee CTF web, crypto et cloud offensive.",
      },
    }),
    prisma.team.create({
      data: {
        name: "BlueOps Defenders",
        description:
          "Groupe focalise sur la detection, la reponse et la blue team.",
      },
    }),
    prisma.team.create({
      data: {
        name: "Forensic Falcons",
        description:
          "Equipe specialisee en forensic, OSINT et investigations numeriques.",
      },
    }),
  ]);

  // Students represent realistic learner profiles with levels and interests.
  const students = await Promise.all([
    prisma.student.create({
      data: {
        fullName: "Amina Ben Salem",
        email: "amina.bensalem@cyberhub.tn",
        level: StudentLevel.INTERMEDIATE,
        interests: ["Web Security", "OSINT", "Bug Bounty"],
        teamId: teams[0].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Youssef Gharbi",
        email: "youssef.gharbi@cyberhub.tn",
        level: StudentLevel.ADVANCED,
        interests: ["Reverse Engineering", "Malware Analysis"],
        teamId: teams[2].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Meriem Trabelsi",
        email: "meriem.trabelsi@cyberhub.tn",
        level: StudentLevel.BEGINNER,
        interests: ["Blue Team", "SIEM", "Incident Response"],
        teamId: teams[1].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Bilel Karray",
        email: "bilel.karray@cyberhub.tn",
        level: StudentLevel.INTERMEDIATE,
        interests: ["Cryptography", "CTF", "Scripting"],
        teamId: teams[0].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Sarra Chaabane",
        email: "sarra.chaabane@cyberhub.tn",
        level: StudentLevel.ADVANCED,
        interests: ["Cloud Security", "IAM", "DevSecOps"],
        teamId: teams[1].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Hamza Dridi",
        email: "hamza.dridi@cyberhub.tn",
        level: StudentLevel.INTERMEDIATE,
        interests: ["Forensics", "Memory Analysis"],
        teamId: teams[2].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Nour El Houda Kefi",
        email: "nour.kefi@cyberhub.tn",
        level: StudentLevel.BEGINNER,
        interests: ["Network Security", "Wireshark", "Linux"],
        teamId: teams[1].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Omar Zoghlami",
        email: "omar.zoghlami@cyberhub.tn",
        level: StudentLevel.ADVANCED,
        interests: ["Web Security", "API Security", "GraphQL"],
        teamId: teams[0].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Rim Jebali",
        email: "rim.jebali@cyberhub.tn",
        level: StudentLevel.INTERMEDIATE,
        interests: ["OSINT", "Threat Intelligence"],
        teamId: teams[2].id,
      },
    }),
    prisma.student.create({
      data: {
        fullName: "Khalil Bouazizi",
        email: "khalil.bouazizi@cyberhub.tn",
        level: StudentLevel.BEGINNER,
        interests: ["Cryptography", "Python", "Beginner CTF"],
        teamId: teams[0].id,
      },
    }),
  ]);

  // Events model a varied academic cybersecurity calendar.
  const events = await Promise.all([
    prisma.cyberEvent.create({
      data: {
        title: "Tunisia Web Exploitation Sprint",
        description:
          "Competition intensive sur les failles web modernes et les attaques API.",
        location: "INSAT, Tunis",
        startDate: new Date("2026-02-14T09:00:00Z"),
        endDate: new Date("2026-02-15T18:00:00Z"),
        type: EventType.CTF,
      },
    }),
    prisma.cyberEvent.create({
      data: {
        title: "Blue Team Detection Workshop",
        description:
          "Atelier pratique autour des journaux, de Sigma et des scenarii de detection.",
        location: "ENIT, Tunis",
        startDate: new Date("2026-03-05T08:30:00Z"),
        endDate: new Date("2026-03-05T16:30:00Z"),
        type: EventType.WORKSHOP,
      },
    }),
    prisma.cyberEvent.create({
      data: {
        title: "Cloud Security Student Bootcamp",
        description:
          "Bootcamp sur la securite AWS, IAM, secrets et durcissement CI/CD.",
        location: "SupCom, Ariana",
        startDate: new Date("2026-03-21T09:00:00Z"),
        endDate: new Date("2026-03-22T17:00:00Z"),
        type: EventType.BOOTCAMP,
      },
    }),
    prisma.cyberEvent.create({
      data: {
        title: "Digital Forensics Meetup",
        description:
          "Session communautaire dediee a l'analyse disque, memoire et timeline.",
        location: "Sfax Engineering School",
        startDate: new Date("2026-04-10T14:00:00Z"),
        endDate: new Date("2026-04-10T19:00:00Z"),
        type: EventType.MEETUP,
      },
    }),
    prisma.cyberEvent.create({
      data: {
        title: "National Student Cyber Conference",
        description:
          "Conference avec interventions sur la menace cloud, l'OSINT et la securite defensive.",
        location: "Palais des Congres, Tunis",
        startDate: new Date("2026-05-16T08:00:00Z"),
        endDate: new Date("2026-05-17T17:30:00Z"),
        type: EventType.CONFERENCE,
      },
    }),
  ]);

  // Challenges are distributed across categories, difficulties and optional events.
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: "JWT Maze",
        description:
          "Exploiter une mauvaise validation JWT sur une API GraphQL.",
        category: CyberCategory.WEB_SECURITY,
        difficulty: ChallengeDifficulty.MEDIUM,
        points: 250,
        eventId: events[0].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Cookie Crumbs",
        description:
          "Abus d'un mecanisme de session vulnerable au session fixation.",
        category: CyberCategory.WEB_SECURITY,
        difficulty: ChallengeDifficulty.EASY,
        points: 100,
        eventId: events[0].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Padding Oracle Encore",
        description:
          "Attaque classique de dechiffrement adaptatif sur un service CBC.",
        category: CyberCategory.CRYPTOGRAPHY,
        difficulty: ChallengeDifficulty.HARD,
        points: 400,
        eventId: events[0].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Sigma Sleuth",
        description:
          "Construire une regle Sigma a partir d'evenements suspects.",
        category: CyberCategory.BLUE_TEAM,
        difficulty: ChallengeDifficulty.MEDIUM,
        points: 220,
        eventId: events[1].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Phantom Beacon",
        description:
          "Identifier un beacon C2 discret dans des logs EDR reduits.",
        category: CyberCategory.BLUE_TEAM,
        difficulty: ChallengeDifficulty.HARD,
        points: 350,
        eventId: events[1].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "IAM Escalation Path",
        description:
          "Trouver une chaine d'escalade de privilege dans un compte cloud mal configure.",
        category: CyberCategory.CLOUD_SECURITY,
        difficulty: ChallengeDifficulty.HARD,
        points: 420,
        eventId: events[2].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Leaky S3 Bucket",
        description:
          "Enumere un stockage expose et reconstitue la cle d'acces fuitee.",
        category: CyberCategory.CLOUD_SECURITY,
        difficulty: ChallengeDifficulty.EASY,
        points: 120,
        eventId: events[2].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Memory Echoes",
        description:
          "Analyse un dump memoire pour retrouver une execution PowerShell malveillante.",
        category: CyberCategory.FORENSICS,
        difficulty: ChallengeDifficulty.MEDIUM,
        points: 260,
        eventId: events[3].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Timeline Tangle",
        description:
          "Reconstruire une chronologie d'incident a partir d'artefacts Windows.",
        category: CyberCategory.FORENSICS,
        difficulty: ChallengeDifficulty.HARD,
        points: 390,
        eventId: events[3].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "MalDoc Mystery",
        description:
          "Dissquer une macro Office obfusquee et extraire son payload.",
        category: CyberCategory.REVERSE_ENGINEERING,
        difficulty: ChallengeDifficulty.HARD,
        points: 430,
        eventId: events[4].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Packed Runner",
        description:
          "Depacker un binaire Linux et identifier son algorithme de persistance.",
        category: CyberCategory.REVERSE_ENGINEERING,
        difficulty: ChallengeDifficulty.INSANE,
        points: 500,
        eventId: events[4].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Handle Hunter",
        description:
          "Tracer l'identite numerique d'une cible a partir d'un pseudo unique.",
        category: CyberCategory.OSINT,
        difficulty: ChallengeDifficulty.EASY,
        points: 90,
        eventId: events[4].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "GeoTrace",
        description:
          "Croiser indices visuels et metadonnees pour geolocaliser une photo.",
        category: CyberCategory.OSINT,
        difficulty: ChallengeDifficulty.MEDIUM,
        points: 240,
        eventId: events[4].id,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Packet Whisperer",
        description:
          "Analyser un trafic reseau pour retrouver une exfiltration DNS.",
        category: CyberCategory.NETWORK_SECURITY,
        difficulty: ChallengeDifficulty.MEDIUM,
        points: 230,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "BGP Mirage",
        description:
          "Etudier un incident de routage et identifier la route mal annoncee.",
        category: CyberCategory.NETWORK_SECURITY,
        difficulty: ChallengeDifficulty.HARD,
        points: 370,
      },
    }),
  ]);

  // Writeups are created only after both authors and challenges exist.
  const writeupSources = [
    {
      title: "Bypassing weak JWT validation",
      content:
        "Le writeup montre comment l'application acceptait un algorithme modifie et comment forger un token admin en observant la cle publique exposee.",
      authorId: students[7].id,
      challengeId: challenges[0].id,
    },
    {
      title: "Session fixation from first principles",
      content:
        "Nous avons force la victime a reutiliser un identifiant de session controle, puis valide le flag apres connexion avec un cookie persistant.",
      authorId: students[0].id,
      challengeId: challenges[1].id,
    },
    {
      title: "Recovering plaintext with oracle responses",
      content:
        "Le serveur repondait differemment selon le padding. En automatisant la requete, nous avons recupere le secret bloc par bloc.",
      authorId: students[3].id,
      challengeId: challenges[2].id,
    },
    {
      title: "Writing Sigma rules from suspicious process trees",
      content:
        "Le challenge pouvait etre resolu en isolant la creation de processus anormale et en ajoutant des selections sur parent_image et commandline.",
      authorId: students[2].id,
      challengeId: challenges[3].id,
    },
    {
      title: "Beacon hunting in sparse EDR telemetry",
      content:
        "Le pattern de periodicite et la sequence DNS ont permis d'identifier le beacon et la commande finale de l'attaquant.",
      authorId: students[4].id,
      challengeId: challenges[4].id,
    },
    {
      title: "Privilege escalation in misconfigured IAM roles",
      content:
        "Une role chain permissive autorisait sts:AssumeRole vers un role de deploiement disposant de droits administrateurs.",
      authorId: students[4].id,
      challengeId: challenges[5].id,
    },
    {
      title: "Finding secrets in public storage snapshots",
      content:
        "Nous avons exploite une sauvegarde oubliee dans un bucket public contenant un fichier .env et des cles temporaires encore valides.",
      authorId: students[9].id,
      challengeId: challenges[6].id,
    },
    {
      title: "Memory artifact triage with Volatility",
      content:
        "L'utilisation combinee de pslist, cmdline et consoles a revele une execution PowerShell encodee chargeant un script distant.",
      authorId: students[5].id,
      challengeId: challenges[7].id,
    },
    {
      title: "Timeline reconstruction for incident response",
      content:
        "Le point cle etait de correlier MFT, journaux d'evenements et traces prefetch pour ordonner les actions de l'attaquant.",
      authorId: students[8].id,
      challengeId: challenges[8].id,
    },
    {
      title: "MalDoc macro unpacking notes",
      content:
        "Apres deobfuscation VBA, le shellcode telechargeait une DLL chiffree ensuite injectee dans un processus legitime.",
      authorId: students[1].id,
      challengeId: challenges[9].id,
    },
  ];

  await prisma.writeup.createMany({
    data: writeupSources,
  });

  // Resources enrich the platform with external learning references.
  const resourceData = [
    [
      "GraphQL API Security Checklist",
      "Bonnes pratiques pour proteger les resolvers, schemas et autorisations.",
      "https://owasp.org/www-project-graphql-security/",
      CyberCategory.WEB_SECURITY,
      ResourceLevel.INTERMEDIATE,
    ],
    [
      "PortSwigger Web Security Academy",
      "Laboratoires pratiques sur les failles web les plus courantes.",
      "https://portswigger.net/web-security",
      CyberCategory.WEB_SECURITY,
      ResourceLevel.BEGINNER,
    ],
    [
      "CryptoHack",
      "Plateforme progressive pour apprendre la cryptographie appliquee.",
      "https://cryptohack.org/",
      CyberCategory.CRYPTOGRAPHY,
      ResourceLevel.BEGINNER,
    ],
    [
      "Practical Cryptography Notes",
      "Resume des notions AES, RSA, hash et attaques courantes.",
      "https://cryptobook.nakov.com/",
      CyberCategory.CRYPTOGRAPHY,
      ResourceLevel.INTERMEDIATE,
    ],
    [
      "Volatility Foundation",
      "Outils et documentation pour l'analyse memoire.",
      "https://volatilityfoundation.org/",
      CyberCategory.FORENSICS,
      ResourceLevel.INTERMEDIATE,
    ],
    [
      "Autopsy User Guide",
      "Guide pour l'analyse disque et les timelines forensiques.",
      "https://www.autopsy.com/documentation/",
      CyberCategory.FORENSICS,
      ResourceLevel.BEGINNER,
    ],
    [
      "Malware Unicorn RE 101",
      "Ressource d'introduction au reverse engineering malware.",
      "https://malwareunicorn.org/workshops/re101.html",
      CyberCategory.REVERSE_ENGINEERING,
      ResourceLevel.BEGINNER,
    ],
    [
      "Practical Binary Analysis",
      "Reference pour ELF, PE, désassemblage et instrumentation.",
      "https://nostarch.com/binaryanalysis",
      CyberCategory.REVERSE_ENGINEERING,
      ResourceLevel.ADVANCED,
    ],
    [
      "OSINT Framework",
      "Panorama d'outils pour la collecte d'informations ouvertes.",
      "https://osintframework.com/",
      CyberCategory.OSINT,
      ResourceLevel.BEGINNER,
    ],
    [
      "Bellingcat Guides",
      "Methodes d'investigation open source et verification visuelle.",
      "https://www.bellingcat.com/resources/",
      CyberCategory.OSINT,
      ResourceLevel.INTERMEDIATE,
    ],
    [
      "MITRE ATT&CK",
      "Base de connaissances pour cartographier les techniques offensives.",
      "https://attack.mitre.org/",
      CyberCategory.BLUE_TEAM,
      ResourceLevel.INTERMEDIATE,
    ],
    [
      "Sigma Rule Repository",
      "Exemples de regles de detection partagees par la communaute.",
      "https://github.com/SigmaHQ/sigma",
      CyberCategory.BLUE_TEAM,
      ResourceLevel.INTERMEDIATE,
    ],
    [
      "AWS Security Best Practices",
      "Recommandations de securisation IAM, logging et reseau.",
      "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/",
      CyberCategory.CLOUD_SECURITY,
      ResourceLevel.INTERMEDIATE,
    ],
    [
      "CloudGoat",
      "Environnement vulnerable pour pratiquer des scenarios cloud.",
      "https://github.com/RhinoSecurityLabs/cloudgoat",
      CyberCategory.CLOUD_SECURITY,
      ResourceLevel.ADVANCED,
    ],
    [
      "Wireshark Display Filters",
      "Reference utile pour analyser rapidement du trafic reseau.",
      "https://www.wireshark.org/docs/dfref/",
      CyberCategory.NETWORK_SECURITY,
      ResourceLevel.BEGINNER,
    ],
    [
      "Zeek Documentation",
      "Documentation pour la surveillance reseau et les logs analytiques.",
      "https://docs.zeek.org/",
      CyberCategory.NETWORK_SECURITY,
      ResourceLevel.ADVANCED,
    ],
    [
      "OWASP Top 10",
      "Vue d'ensemble des risques applicatifs modernes.",
      "https://owasp.org/www-project-top-ten/",
      CyberCategory.WEB_SECURITY,
      ResourceLevel.BEGINNER,
    ],
    [
      "Blue Team Labs Online",
      "Plateforme orientee detection et investigations.",
      "https://blueteamlabs.online/",
      CyberCategory.BLUE_TEAM,
      ResourceLevel.BEGINNER,
    ],
    [
      "SANS DFIR Poster",
      "Memo visuel sur les artefacts forensiques Windows.",
      "https://www.sans.org/posters/",
      CyberCategory.FORENSICS,
      ResourceLevel.INTERMEDIATE,
    ],
    [
      "Security Onion Docs",
      "Distribution et guide de supervision securite.",
      "https://docs.securityonion.net/",
      CyberCategory.BLUE_TEAM,
      ResourceLevel.ADVANCED,
    ],
  ] as const;

  for (const [title, description, url, category, level] of resourceData) {
    await prisma.learningResource.create({
      data: {
        title,
        description,
        url,
        category,
        level,
      },
    });
  }

  console.log("Seed completed with realistic cybersecurity demo data.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
