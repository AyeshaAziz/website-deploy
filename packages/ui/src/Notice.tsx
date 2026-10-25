import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@itqasys/core';

export type NoticeTone = 'info' | 'gold';

const TONES: Record<NoticeTone, string> = {
  info: 'border-primary-5 bg-primary-6',
  gold: 'border-accent-gold/40 bg-accent-gold/10',
};

export type NoticeProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  tone?: NoticeTone;
};

export function Notice({
  title,
  tone = 'info',
  className,
  children,
  ...props
}: NoticeProps): ReactNode {
  return (
    <div
      className={cn(
        'rounded-card border p-5 text-small text-neutral-700',
        TONES[tone],
        className,
      )}
      {...props}
    >
      {title ? (
        <h3 className="mb-2 font-heading text-h3 text-primary-neg2">{title}</h3>
      ) : null}
      <div className="space-y-3">{children}</div>
    </div>
  );
}
