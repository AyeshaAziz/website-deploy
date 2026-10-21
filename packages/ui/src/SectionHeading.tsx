import type { ReactNode } from 'react';
import { cn } from '@itqa/core';

export interface SectionHeadingProps {
  title: string;
  /** Optional Arabic subtitle rendered right-to-left. */
  arabicSubtitle?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

const sizeByTag: Record<'h1' | 'h2' | 'h3', string> = {
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
};

/** Section title with an optional Arabic subtitle. */
export function SectionHeading({
  title,
  subtitle,
  arabicSubtitle,
  align = 'left',
  as = 'h2',
  className,
}: SectionHeadingProps): ReactNode {
  const Tag = as;
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <Tag className={cn('font-heading text-primary-neg2', sizeByTag[as])}>{title}</Tag>
      {arabicSubtitle && (
        <p dir="rtl" lang="ar" className="mt-1 font-arabic text-h3 text-primary-neg1">
          {arabicSubtitle}
        </p>
      )}
      {subtitle && <p className="mt-2 max-w-2xl text-body text-neutral-600">{subtitle}</p>}
    </div>
  );
}
