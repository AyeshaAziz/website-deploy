'use client';

import { useState, type ReactNode } from 'react';
import { SectionHeading } from '@itqa/ui';
import { NotificationBell } from '../indicators/NotificationBell';
import { EnquiriesIndicator } from '../indicators/EnquiriesIndicator';

type DashboardSection = 'registrations' | 'enquiries';

interface DashboardSectionsProps {
  pendingCount: number;
  enquiryCount: number;
  intro: ReactNode;
  registrations: ReactNode;
  enquiries: ReactNode;
}

export function DashboardSections({
  pendingCount,
  enquiryCount,
  intro,
  registrations,
  enquiries,
}: DashboardSectionsProps): ReactNode {
  const [section, setSection] = useState<DashboardSection>('registrations');

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6 flex shrink-0 items-center justify-between gap-4">
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
        </div>
      </div>
      <div className="shrink-0">{intro}</div>
      <div className={section === 'registrations' ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
        {registrations}
      </div>
      <div className={section === 'enquiries' ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}>
        {enquiries}
      </div>
    </div>
  );
}
