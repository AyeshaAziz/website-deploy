import type { Metadata } from 'next';
import { fn } from '@itqasys/core/forms';

export const metadata: Metadata = {
  title: 'Privacy Policy - ITQA',
  description: 'Privacy policy for ITQA registration and services.',
};

export default async function PrivacyPage() {
  return (
    <section className="prose lg:prose-xl max-w-none">
      <h1 className="text-3xl font-heading mb-6">Privacy Policy</h1>

      <p className="mb-6">
        International Ta'limul Qur'an Academy ('ITQA', 'we', 'our', 'us') is committed to
        protecting and respecting your privacy.
      </p>

      <h2 className="text-2xl font-heading mt-8">Information we collect</h2>
      <ul className="list-disc list-inside mb-6">
        <li>
          Personal information provided during registration (name, contact details,
          tanzeem, course selection).
        </li>
        <li>
          Usage data for improving our services and course placement.
        </li>
      </ul>

      <h2 className="text-2xl font-heading mt-8">How we use your information</h2>
      <ul className="list-disc list-inside mb-6">
        <li>
          To process registrations for Qur'an courses (Atfal, Nasirat, Khuddam, Lajna,
          Ansar).
        </li>
        <li>
          To communicate regarding course updates, schedules, and important notices.
        </li>
        <li>
          To enforce age-appropriate groupings (parental consent required for minors
          in Atfal/Nasirat).
        </li>
      </ul>

      <h2 className="text-2xl font-heading mt-8">Data retention</h2>
      <ul className="list-disc list-inside mb-6">
        <li>
          Registration data is retained while you are actively enrolled in ITQA courses.</li>
        <li>
          After course completion, data is retained per our administrative records
          policy.</li>
      </ul>

      <h2 className="text-2xl font-heading mt-8">Cookies</h2>
      <p className="mb-6">
        Our website uses cookies to enhance your browsing experience. You can disable
        cookies in your browser settings, but this may affect some functionality.
      </p>

      <h2 className="text-2xl font-heading mt-8">Contact us</h2>
      <p className="mb-6">
        If you have any questions about this privacy policy, please contact us at
        <a href="/contact" className="font-semibold text-accent-gold underline">
          contact@itqa.org.uk
        </a>.
      </p>

      <div className="mt-8 p-4 bg-primary-neg2/50 rounded-border text-small">
        <p className="font-semibold">Last updated:</p>
        <p className="mt-1">October 2026</p>
      </div>
    </section>
  );
}