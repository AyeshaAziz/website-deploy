import type { ReactNode } from 'react';
import { cn } from '@itqa/core';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps): ReactNode {
  return <div className={cn('mx-auto w-full max-w-page px-4 sm:px-6', className)}>{children}</div>;
}

export type { ContainerProps as PageContainerProps };
export { Container as PageContainer };
