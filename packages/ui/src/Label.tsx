import type { LabelHTMLAttributes, ReactNode } from 'react';
import { cn } from '@itqasys/core';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps): ReactNode {
  return <label className={cn('block text-small font-medium text-neutral-900', className)} {...props} />;
}
