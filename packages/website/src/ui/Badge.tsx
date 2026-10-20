import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@itqa/shared';

export type BadgeTone = 'primary' | 'gold' | 'success' | 'danger';

const TONES: Record<BadgeTone, string> = {
  primary: 'bg-primary-6 text-primary-neg1',
  gold: 'bg-accent-gold/15 text-primary-neg2',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ tone = 'primary', className, ...props }: BadgeProps): ReactNode {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-small font-medium',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
