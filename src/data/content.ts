export const profile = {
  firstName: "Anatole",
  lastName: "Maes",
  role: "Vidéaste & Photographe",
  location: "Biesme, Namur, Belgique",
  email: "anatolemaes@outlook.com",
  phone: "+32 471 428 211",
  phoneHref: "tel:+32471428211",
  intro:
    "Du storyboard au montage final, je filme et photographie des lieux, des gens et des instants, au sol comme depuis les airs, pour en faire des contenus qui marquent.",
};

export type TimelineItem = {
  kind: "experience" | "education";
  period: string;
  title: string;
  place: string;
  city: string;
  summary?: string;
  details?: string;
};

// Du plus récent au plus ancien
export const timeline: TimelineItem[] = [
  {
    kind: "experience",
    period: "2025-2026",
    title: "Photographe, vidéaste & community manager",
    place: "Les Maisons de Marjorie Toma",
    city: "Tamines",
    summary: "Photographie et réalisation de vidéo pour une agence immobilière.",
    details:
      "Réalisation de vidéos promotionnelles, reportages photo, prises de vue aérienne et création de contenus pour les réseaux sociaux.",
  },
  {
    kind: "experience",
    period: "2024",
    title: "Photographe & vidéaste",
    place: "Speedmotion",
    city: "Charleroi",
    summary: "Lancement d’un projet audiovisuel personnel.",
    details:
      "Création de storyboard, réalisation, prise de vue, montage vidéo, post-production et effets visuels.",
  },
  {
    kind: "experience",
    period: "2022-2024",
    title: "Graphiste & community manager",
    place: "Technofutur TIC",
    city: "Gosselies",
    summary: "Création de visuels, mise en page, identité visuelle et supports de communication.",
    details:
      "Réalisation de vidéos promotionnelles, reportages photo, prises de vue et création de contenus pour les réseaux sociaux et le site web.",
  },
  {
    kind: "education",
    period: "2018-2021",
    title: "Bachelier en Techniques Graphiques",
    place: "I.S.I.P.S.",
    city: "Charleroi",
  },
  {
    kind: "education",
    period: "2014-2018",
    title: "Communication Graphique & Publicitaire",
    place: "H.E.A.J.",
    city: "Namur",
  },
  {
    kind: "education",
    period: "2014",
    title: "CESS, qualification en infographie",
    place: "I.S.S.P.",
    city: "Florennes",
  },
];

export type ProjectContent = {
  title: string;
  category?: string;
  /** Un paragraphe par entrée. Pas de description : rien n'est affiché. */
  description?: string[];
  /** Médias dans l'ordre d'affichage (id = <dossier>/<fichier sans extension>, voir media.json). */
  media: string[];
};

/** Projets dans l'ordre d'affichage. Un média non listé ici n'apparaît pas sur le site. */
export const projects: ProjectContent[] = [
  {
    title: "Concessions automobiles",
    category: "Réseaux sociaux",
    description: [
      "Pour un groupe automobile de la région de Charleroi, j’ai réalisé plusieurs vidéos destinées aux réseaux sociaux, tournées au sein de différentes concessions. L’objectif était de mettre en avant l’image du groupe, la qualité de l’accueil et l’attention portée aux clients, tout en présentant les différents services proposés par les concessions.",
      "À travers ces contenus, j’ai cherché à créer des vidéos dynamiques et accessibles, permettant de valoriser à la fois les établissements, leur équipe et l’expérience proposée aux clients.",
    ],
    media: ["gsl-chatelineau/gsl-chatelineau-3", "gsl-chatelineau/gsl-fontaine-3"],
  },
  {
    title: "Maison d’hôtes",
    category: "Immobilier",
    description: [
      "Pour mon ancien employeur, j’ai eu l’occasion de réaliser une vidéo de présentation d’une maison d’hôtes offrant plusieurs chambres, salles de bains et un niveau de confort particulièrement élevé.",
      "L’objectif était de mettre en valeur les volumes généreux des différentes pièces, le cadre rural et paisible dans lequel se situe le bien, ainsi que l’important espace extérieur. J’ai notamment cherché à souligner la taille du jardin et les différents espaces disponibles afin de montrer que cette propriété était parfaitement adaptée à l’accueil de nombreux invités, notamment pour des réceptions, des événements ou des séjours en groupe.",
    ],
    media: ["les-maisons-de-marjorie-toma/vodelvid"],
  },
  {
    title: "Agence de voyage Michaux",
    category: "Interview",
    description: [
      "Voici un extrait d’une interview que j’ai réalisée dans le cadre d’un concours organisé par une agence de voyages. L’objectif était de raconter l’histoire de l’agence, de mettre en avant son identité et son parcours, tout en retranscrivant l’atmosphère particulière du lieu.",
    ],
    media: ["michaux/michaux"],
  },
  {
    title: "Toyota GT86",
    category: "Projet personnel",
    description: [
      "Pour ce projet personnel, j’ai réalisé une vidéo dynamique mettant en valeur une voiture à travers une approche immersive et cinématographique. Inspiré par l’univers automobile japonais, j’ai travaillé les mouvements de caméra, les angles de prise de vue et le rythme du montage afin de retranscrire le caractère et l’esthétique du véhicule.",
    ],
    media: ["automobile/toyota"],
  },
  {
    title: "Prise de vue aérienne",
    category: "Drone A1/A3 et Open A2",
    description: [
      "Grâce à l’obtention de différents certificats et brevets de pilotage de drone (A1, A3 et Open A2), j’ai eu l’occasion de réaliser des prises de vue aériennes lors de différentes missions professionnelles.",
      "Le drone est un outil avec lequel je suis particulièrement à l’aise et que j’utilise pour apporter une perspective différente aux projets que je réalise. Avant chaque vol, j’accorde une attention particulière à l’environnement, aux conditions météorologiques et aux éventuelles contraintes présentes sur le lieu afin de garantir des conditions de vol adaptées et sécurisées.",
    ],
    media: ["personel/dji-20260614144045-0012-d"],
  },
  {
    title: "Photographie",
    category: "Sélection",
    description: [
      "Voici une sélection de photographies réalisées pour différents clients au cours de plusieurs missions. Cette série rassemble différents types de prises de vue : photos d’ambiance, mise en valeur de lieux, présentation de showrooms ainsi que de biens immobiliers destinés à la vente.",
    ],
    media: [
      "les-maisons-de-marjorie-toma/09",
      "les-maisons-de-marjorie-toma/10",
      "les-maisons-de-marjorie-toma/11",
      "automobile/01",
      "les-maisons-de-marjorie-toma/12",
      "les-maisons-de-marjorie-toma/13",
      "les-maisons-de-marjorie-toma/17",
      "les-maisons-de-marjorie-toma/19",
    ],
  },
  {
    title: "Automobile",
    media: ["automobile/lot", "automobile/supertrofeo"],
  },
  {
    title: "Projets personnels",
    media: ["personel/got"],
  },
];

/** Vidéo de fond du hero (id = <dossier>/<fichier sans extension>). */
export const heroMediaId = "hero/banner-video";

export const hardSkills = [
  {
    title: "Prise de vue",
    text: "Cadrage, composition, mouvements de caméra, gestion de la profondeur de champ.",
  },
  {
    title: "Montage",
    text: "Découpage, rythme, transitions, synchronisation image et son.",
  },
  {
    title: "Prise de vue aérienne",
    text: "Pilotage et réalisation de plans avec drone. Certificats A1/A3 et Open A2.",
  },
  {
    title: "Adaptation aux formats",
    text: "Vidéos verticales (9:16), horizontales (16:9), sous-titrage.",
  },
];

export const softSkills = [
  {
    title: "Sens du relationnel",
    text: "Mettre les personnes filmées à l’aise devant la caméra.",
  },
  {
    title: "Créativité",
    text: "Imaginer des concepts, des plans et des univers visuels.",
  },
  {
    title: "Rigueur",
    text: "Être attentif aux détails pendant le tournage et le montage.",
  },
  {
    title: "Résolution de problèmes",
    text: "Trouver vite une solution face à un imprévu technique ou organisationnel.",
  },
];
