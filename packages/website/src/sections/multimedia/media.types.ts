export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  href?: string;
  duration?: string;
  ctaLabel?: string;
}

export interface MediaRow {
  title: string;
  items: MediaItem[];
}

export interface MediaLink {
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface MediaLinksRow {
  title: string;
  links: MediaLink[];
}

export interface MultimediaContent {
  playlist: MediaRow;
  videos: MediaRow;
  links: MediaLinksRow;
}
