export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterAboutData {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface FooterSocialData {
  title: string;
  links: FooterLink[];
}

export interface FooterContactData {
  title: string;
  addressTitle: string;
  addressLines: string[];
  emailTitle: string;
  email: string;
}

export interface FooterMapData {
  label: string;
}

export interface FooterContent {
  about: FooterAboutData;
  social: FooterSocialData;
  contact: FooterContactData;
  map: FooterMapData;
}

export interface FooterProps {
  content?: FooterContent;
  mapSrc?: string;
}
