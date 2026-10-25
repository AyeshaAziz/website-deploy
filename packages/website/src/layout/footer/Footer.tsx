import type { ReactNode } from 'react';
import { Container } from '@itqa/ui';
import footerData from './footer.json';
import { FooterAbout } from './FooterAbout';
import { FooterContact } from './FooterContact';
import { FooterMap } from './FooterMap';
import { FooterSocial } from './FooterSocial';
import { FooterBottom } from './FooterBottom';
import type { FooterProps } from './footer.types';

function mapEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

export function Footer({ content = footerData, mapSrc }: FooterProps): ReactNode {
  const { about, social, contact, map, bottomContent } = content;
  const mapEmbed =
    mapSrc ??
    mapEmbedUrl(contact.addressLines.map((line) => line.replace(/[,\s]+$/, '')).join(', '));

  return (
    <footer className="bg-primary-7 font-cabin font-bold text-primary-5">
      <div className="h-1 w-full bg-accent-gold" aria-hidden="true" />
      <Container className="grid grid-cols-[1.6fr_1fr_1.3fr_1.2fr] gap-4 py-10 sm:gap-8 sm:py-12">
        <FooterAbout {...about} />
        <FooterSocial {...social} />
        <FooterContact {...contact} />
        <FooterMap src={mapEmbed} label={map.label} />
      </Container>
      <FooterBottom content={bottomContent} />
    </footer>
  );
}