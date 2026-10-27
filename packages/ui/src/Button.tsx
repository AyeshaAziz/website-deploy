import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@itqasys/core';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'brand' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-card font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50';

/** Order/meaning follows the Figma "Primary button" sheet: Style 1, 2 and 3. */
const VARIANTS: Record<ButtonVariant, string> = {
  // Style 1 — solid dark
  primary: 'bg-primary-neg2 text-white hover:bg-primary-neg1',
  // Style 2 — white with a light border
  secondary: 'border border-primary-5 bg-white text-primary-neg1 hover:bg-primary-6',
  // Style 3 — light tonal fill
  tertiary: 'bg-primary-5 text-primary-neg1 hover:bg-primary-4',
  // Brand submit button
  brand: 'bg-primary-8 text-white hover:bg-primary-1',
  // Accent (hero ornaments, highlights) — not part of the three primary styles
  gold: 'bg-accent-gold text-primary-neg2 hover:brightness-95',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-small',
  md: 'px-5 py-2.5 text-body',
  lg: 'px-6 py-3 text-body',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant, size, className, ...props }: ButtonProps): ReactNode {
  return <button type={props.type ?? 'button'} className={buttonClasses({ variant, size, className })} {...props} />;
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps): ReactNode {
  return <a className={buttonClasses({ variant, size, className })} {...props} />;
}
