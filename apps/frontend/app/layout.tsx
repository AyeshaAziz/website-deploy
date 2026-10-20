import type { Metadata } from 'next';
import { Amiri, Cabin, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const heading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const cabin = Cabin({ subsets: ['latin'], variable: '--font-cabin', display: 'swap' });
const arabic = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-arabic', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'ITQA', template: '%s | ITQA' },
  description: 'International Ta\u2019limul Qur\u2019an Academy',
  icons: {
    icon: { url: '/images/favicon.png', type: 'image/png' },
    shortcut: '/images/favicon.png',
    apple: { url: '/images/favicon.png', type: 'image/png' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${heading.variable} ${cabin.variable} ${arabic.variable}`}
    >
      <body className="min-h-screen bg-primary-6 font-sans text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
