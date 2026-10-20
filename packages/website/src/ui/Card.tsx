import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@itqa/shared';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps): ReactNode {
  return (
    <div
      className={cn('rounded-card border border-primary-5 bg-white p-5 shadow-card', className)}
      {...props}
    />
  );
}
