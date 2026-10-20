import type { ReactNode, SelectHTMLAttributes } from 'react';
import { fieldClasses } from './field';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps): ReactNode {
  return <select className={fieldClasses(className)} {...props} />;
}
