import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, Container } from '@itqa/ui';
import { PageAside } from '@/components/PageAside';

export const metadata: Metadata = {
  title: 'Privacy Policy - ITQA',
  description: 'Privacy policy for ITQA registration and services.',
};

const PRIVACY_ASIDE = {
  image: {
    src: '/images/background/islamic-lattice.webp',
    alt: '',
    width: 1600,
    height: 671,
    sizes: '(min-width: 1024px) 45vw, 100vw',
  },
  heading: 'Your privacy matters',
  body: 'How ITQA collects, uses, and protects the information you share with us.',
} as const;

export default function PrivacyPage() {
  return (
    <Container className="py-section-sm">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Card className="order-2 min-w-0 bg-white/70 p-5 shadow-lg shadow-primary-7/20">
          <h1 className="mb-6 font-heading text-h1 text-primary-neg2">Privacy Policy</h1>
          <p className="mb-6 text-body text-neutral-700">
            International Ta&apos;limul Qur&apos;an Academy (&apos;ITQA&apos;, &apos;we&apos;,
            &apos;our&apos;, &apos;us&apos;) is committed to protecting and respecting your privacy.
          </p>

          <h2 className="mt-8 font-heading text-h2 text-primary-neg2">Information we collect</h2>
          <ul className="mb-6 list-inside list-disc text-body text-neutral-700">
            <li>
              Personal information provided during registration (name, contact details, tanzeem,
              course selection).
            </li>
            <li>Usage data for improving our services and course placement.</li>
          </ul>

          <h2 className="mt-8 font-heading text-h2 text-primary-neg2">
            How we use your information
          </h2>
          <ul className="mb-6 list-inside list-disc text-body text-neutral-700">
            <li>
              To process registrations for Qur&apos;an courses (Atfal, Nasirat, Khuddam, Lajna,
              Ansar).
            </li>
            <li>To communicate regarding course updates, schedules, and important notices.</li>
            <li>
              To enforce age-appropriate groupings (parental consent required for minors in
              Atfal/Nasirat).
            </li>
          </ul>

          <h2 className="mt-8 font-heading text-h2 text-primary-neg2">Data retention</h2>
          <ul className="mb-6 list-inside list-disc text-body text-neutral-700">
            <li>Registration data is retained while you are actively enrolled in ITQA courses.</li>
            <li>
              After course completion, data is retained per our administrative records policy.
            </li>
          </ul>

          <h2 className="mt-8 font-heading text-h2 text-primary-neg2">Cookies</h2>
          <p className="mb-6 text-body text-neutral-700">
            Our website uses cookies to enhance your browsing experience. You can disable cookies in
            your browser settings, but this may affect some functionality.
          </p>

          <h2 className="mt-8 font-heading text-h2 text-primary-neg2">Contact us</h2>
          <p className="mb-6 text-body text-neutral-700">
            If you have any questions about this privacy policy, please contact us at{' '}
            <Link href="/contact" className="font-semibold text-accent-gold underline">
              contact@itqa.org.uk
            </Link>
            .
          </p>

          <div className="mt-8 rounded-card border border-primary-5 bg-primary-6 p-4 text-small text-neutral-700">
            <p className="font-semibold">Last updated:</p>
            <p className="mt-1">October 2026</p>
          </div>
        </Card>
        <PageAside
          image={PRIVACY_ASIDE.image}
          heading={PRIVACY_ASIDE.heading}
          body={PRIVACY_ASIDE.body}
          headingId="privacy-aside-heading"
          className="order-1"
        />
      </div>
    </Container>
  );
}
