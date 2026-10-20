'use client';

import { NavItem, cn } from '@itqa/shared';
import { type ReactNode, useState } from 'react';
import { ChevronDown } from './ChevronDown';

const ROW_BASE = 'flex w-full items-center rounded-card text-left text-small font-medium';

function rowPadding(depth: number): string {
  return depth === 0 ? 'px-3 py-3' : 'px-2 py-2';
}

export function MobileNav({
  items,
  activeHref,
  onNavigate,
  depth = 0,
}: {
  items: NavItem[];
  activeHref?: string;
  onNavigate: (href: string) => void;
  depth?: number;
}): ReactNode {
  return (
    <ul
      className={cn(
        'space-y-1',
        depth > 0 && 'mt-1 border-l border-white/15 pl-3',
      )}
    >
      {items.map((item) => (
        <MobileNavItem
          key={item.href ?? item.label}
          item={item}
          activeHref={activeHref}
          onNavigate={onNavigate}
          depth={depth}
        />
      ))}
    </ul>
  );
}

function MobileNavItem({
  item,
  activeHref,
  onNavigate,
  depth,
}: {
  item: NavItem;
  activeHref?: string;
  onNavigate: (href: string) => void;
  depth: number;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const padding = rowPadding(depth);
  const active =
    (item.href !== undefined && activeHref === item.href) ||
    item.options?.some((option) => option.href !== undefined && activeHref === option.href) === true;

  if (item.options?.length) {
    return (
      <li>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            ROW_BASE,
            'justify-between',
            padding,
            open || active ? 'bg-white/10 text-white' : 'text-white hover:bg-white/10',
          )}
        >
          {item.label}
          <ChevronDown
            className={cn('transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
        {open && (
          <MobileNav
            items={item.options}
            activeHref={activeHref}
            onNavigate={onNavigate}
            depth={depth + 1}
          />
        )}
      </li>
    );
  }

  if (!item.href) {
    return <li className={cn(ROW_BASE, padding, 'text-white/80')}>{item.label}</li>;
  }

  const selected = activeHref === item.href;

  return (
    <li>
      <button
        type="button"
        aria-current={selected ? 'page' : undefined}
        onClick={() => onNavigate(item.href as string)}
        className={cn(
          ROW_BASE,
          padding,
          selected ? 'bg-white font-semibold text-primary-neg1' : 'text-white hover:bg-white/10',
        )}
      >
        {item.label}
      </button>
    </li>
  );
}
