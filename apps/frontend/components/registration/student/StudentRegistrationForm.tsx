'use client';

import { useCallback, useState, type ReactNode } from 'react';
import type { CourseDTO, Tanzeem } from '@itqa/core';
import { RegistrationForm } from '../form/RegistrationForm';
import { AtfalNasiratPanel } from './AtfalNasiratPanel';
import { StudentRegistrationCard } from './StudentRegistrationCard';
import { StudentRegistrationHeader } from './StudentRegistrationHeader';

const ATFAL_NASIRAT = ['atfal', 'nasirat'];

export interface StudentRegistrationFormProps {
  courseTitle?: string;
  courses?: CourseDTO[];
  defaultCourse?: string;
  tanzeemOptions?: readonly Tanzeem[];
  defaultTanzeem?: Tanzeem;
}

export function StudentRegistrationForm({
  courseTitle,
  courses,
  defaultCourse,
  tanzeemOptions,
  defaultTanzeem,
}: StudentRegistrationFormProps): ReactNode {
  const [tanzeem, setTanzeem] = useState<string | undefined>(defaultTanzeem);
  const showAtfalNasiratNotice =
    tanzeem !== undefined && ATFAL_NASIRAT.includes(tanzeem);

  const handleWatchChange = useCallback((value: unknown) => {
    setTanzeem(typeof value === 'string' ? value : undefined);
  }, []);

  return (
    <StudentRegistrationCard
      aside={showAtfalNasiratNotice ? <AtfalNasiratPanel /> : undefined}
    >
      <StudentRegistrationHeader courseTitle={courseTitle} />

      <div className="mt-6">
        <RegistrationForm
          track="student"
          courses={courses}
          defaultCourse={defaultCourse}
          tanzeemOptions={tanzeemOptions}
          defaultTanzeem={defaultTanzeem}
          watchField="tanzeem"
          onWatchChange={handleWatchChange}
        />
      </div>
    </StudentRegistrationCard>
  );
}
