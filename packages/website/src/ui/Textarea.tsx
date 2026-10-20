import type { ReactNode, TextareaHTMLAttributes } from 'react';
import { fieldClasses } from './field';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps): ReactNode {
  return <textarea className={fieldClasses(className)} {...props} />;
}
