'use client';

import { useState, type ReactNode } from 'react';
import { SectionHeading } from '@itqa/ui';
import { NotificationBell } from '../indicators/NotificationBell';
import { EnquiriesIndicator } from '../indicators/EnquiriesIndicator';

type DashboardSection = 'registrations' | 'enquiries';

interface DashboardSectionsProps {
  pendingCount: number;
  enquiryCount: number;
  headerRight: ReactNode;
  intro: ReactNode;
  registrations: ReactNode;
  enquiries: ReactNode;
}

export function DashboardSections({
  pendingCount,
  enquiryCount,
  headerRight,
  intro,
  registrations,
  enquiries,
}: DashboardSectionsProps): ReactNode {
  const [section, setSection] = useState<DashboardSection>('registrations');

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <SectionHeading as="h1" title="Dashboard" />
        <div className="flex items-center gap-3">
          <NotificationBell
            count={pendingCount}
            active={section === 'registrations'}
            onPress={() => setSection('registrations')}
          />
          <EnquiriesIndicator
            count={enquiryCount}
            active={section === 'enquiries'}
            onPress={() => setSection('enquiries')}
          />
          {headerRight}
        </div>
      </div>
      {intro}
      {section === 'registrations' ? registrations : enquiries}
    </>
  );
}
