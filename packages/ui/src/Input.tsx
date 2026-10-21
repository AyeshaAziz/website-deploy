import type { InputHTMLAttributes, ReactNode } from 'react';
import { fieldClasses } from './field';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps): ReactNode {
  return <input className={fieldClasses(className)} {...props} />;
}
