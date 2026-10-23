'use client';

import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react';
import { cn, NavItem } from '@itqa/core';
import { ChevronDown } from './ChevronDown';

export type NavBarTone = 'dark' | 'light';
export type NavBarSize = 'sm' | 'md';

export type NavBarProps = {
  items: NavItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  tone?: NavBarTone;
  size?: NavBarSize;
  divided?: boolean;
  ariaLabel?: string;
  className?: string;
};

type ToneClasses = {
  item: string;
  active: string;
};

const TONES: Record<NavBarTone, ToneClasses> = {
  dark: {
    item: 'text-white hover:text-primary-6 ',
    active: 'bg-white text-primary-neg1',
  },
  light: {
    item: 'text-primary-neg1 hover:text-primary-1',
    active: 'font-semibold text-primary-neg2',
  },
};

const SIZES: Record<NavBarSize, { text: string; dark: string; light: string; divider: string }> = {
  md: { text: 'text-small', dark: 'h-12 px-4', light: 'px-1 py-1', divider: 'h-6' },
  sm: { text: 'text-[0.6875rem]', dark: 'h-10 px-2', light: 'px-1 py-0.5', divider: 'h-3.5' },
};

export function NavBar({
  items,
  activeHref,
  onNavigate,
  tone = 'dark',
  size = 'md',
  divided = false,
  ariaLabel = 'Main',
  className,
}: NavBarProps): ReactNode {
  const gap = divided ? (size === 'md' ? 'gap-x-4' : 'gap-x-2') : 'gap-x-2';

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className={cn('flex flex-wrap items-center', SIZES[size].text, gap)}>
        {items.map((item, index) => (
          <Fragment key={item.href ?? item.label}>
            {divided && index > 0 && (
              <li
                role="presentation"
                aria-hidden="true"
                className={cn('w-px shrink-0 bg-primary-5', SIZES[size].divider)}
              />
            )}
            <NavItemView
              item={item}
              activeHref={activeHref}
              onNavigate={onNavigate}
              tone={tone}
              size={size}
              align={index === items.length - 1 ? 'right' : 'left'}
            />
          </Fragment>
        ))}
      </ul>
    </nav>
  );
}

function itemPadding(tone: NavBarTone, size: NavBarSize): string {
  return tone === 'light' ? SIZES[size].light : SIZES[size].dark;
}

function NavItemView({
  item,
  activeHref,
  onNavigate,
  tone,
  size,
  align,
}: {
  item: NavItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
  tone: NavBarTone;
  size: NavBarSize;
  align: 'left' | 'right';
}): ReactNode {
  const colors = TONES[tone];
  const padding = itemPadding(tone, size);

  if (item.options?.length) {
    return (
      <NavDropdown
        item={item}
        activeHref={activeHref}
        onNavigate={onNavigate}
        tone={tone}
        size={size}
        align={align}
      />
    );
  }

  if (!item.href) {
    return (
      <li className={cn('inline-flex items-center font-medium', padding, colors.item)}>
        <span>{item.label}</span>
      </li>
    );
  }

  const selected = activeHref === item.href;

  return (
    <li>
      <button
        type="button"
        aria-current={selected ? 'page' : undefined}
        onClick={() => onNavigate?.(item.href as string)}
        className={cn(
          'inline-flex items-center font-medium',
          padding,
          selected ? colors.active : colors.item,
        )}
      >
        {item.label}
      </button>
    </li>
  );
}

function NavDropdown({
  item,
  activeHref,
  onNavigate,
  tone,
  size,
  align,
  depth = 0,
}: {
  item: NavItem;
  activeHref?: string;
  onNavigate?: (href: string) => void;
  tone: NavBarTone;
  size: NavBarSize;
  align: 'left' | 'right';
  depth?: number;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);
  const nested = depth > 0;
  const colors = TONES[nested ? 'light' : tone];

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node | null)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      containerRef.current?.querySelector('button')?.focus();
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const active =
    (item.href !== undefined && activeHref === item.href) ||
    item.options?.some((option) => option.href !== undefined && activeHref === option.href) ===
      true;

  return (
    <li
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'font-medium',
          nested
            ? 'flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-small hover:bg-primary-6'
            : 'inline-flex items-center gap-1.5',
          nested ? undefined : itemPadding(tone, size),
          active ? colors.active : colors.item,
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            'transition-transform duration-200',
            nested ? (open ? 'rotate-0' : '-rotate-90') : open && 'rotate-180',
          )}
        />
      </button>
      {open && item.options && (
        <ul
          className={cn(
            'absolute z-40 min-w-56 rounded-card border border-primary-5 bg-white py-1 shadow-card',
            nested
              ? 'left-full top-0 ml-2'
              : `top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'}`,
          )}
        >
          {item.options.map((option) =>
            option.options?.length ? (
              <NavDropdown
                key={option.href ?? option.label}
                item={option}
                activeHref={activeHref}
                onNavigate={(href) => {
                  setOpen(false);
                  onNavigate?.(href);
                }}
                tone={tone}
                size={size}
                align={align}
                depth={depth + 1}
              />
            ) : (
              <li key={option.href ?? option.label}>
                {option.href ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.(option.href as string);
                    }}
                    className={cn(
                      'block w-full px-4 py-2 text-left text-small hover:bg-primary-6',
                      activeHref === option.href
                        ? 'font-semibold text-primary-neg2'
                        : 'text-primary-neg1',
                    )}
                  >
                    {option.label}
                  </button>
                ) : (
                  <span className="block px-4 py-2 text-small text-neutral-500">
                    {option.label}
                  </span>
                )}
              </li>
            ),
          )}
        </ul>
      )}
    </li>
  );
}
