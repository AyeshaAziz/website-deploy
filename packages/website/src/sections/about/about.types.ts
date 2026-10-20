export interface AboutIntroCard {
  title: string;
  body: string;
}

export interface AboutObjectivesCard {
  title: string;
  preface: string;
  quote: string;
}

export interface AboutIntroData {
  about: AboutIntroCard;
  objectives: AboutObjectivesCard;
}

export interface AboutStat {
  icon: string;
  title: string;
  caption: string;
}

export interface UsefulLink {
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface UsefulLinksData {
  title: string;
  links: UsefulLink[];
}

export interface AboutContent {
  intro: AboutIntroData;
  stats: AboutStat[];
  usefulLinks: UsefulLinksData;
}
