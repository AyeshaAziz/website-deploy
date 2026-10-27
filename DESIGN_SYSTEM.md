# ITQA Design System

Implementation reference for the ITQA public website design system.

Derived from [ITQA_Design_Tokens_and_Screen_Map.md](./ITQA_Design_Tokens_and_Screen_Map.md) (Part 1).
Use this document when adding pages, sections or UI; update it when the system changes.

> **Provisional values.** The Figma design-system frame was too small to read, so every colour,
> font size and weight is *estimated*. Values are marked `// provisional` in
> `packages/core/src/design/tokens.ts`. Replace them from the Figma Variables / Dev Mode export,
> then re-check contrast, before launch.

---

## 1. Where everything lives

| File | Role |
| --- | --- |
| `packages/core/src/design/tokens.ts` | **Single source of truth** for colour, type, spacing, radii, shadows, gradients, screens and CSS variables |
| `packages/core/src/design/index.ts` | Barrel for the design module |
| `apps/frontend/tailwind.config.ts` | Imports the tokens and maps them into Tailwind's `theme.extend` |
| `apps/frontend/app/globals.css` | `:root` CSS variables + `@layer base` defaults (body, headings, focus ring, selection) |
| `apps/frontend/app/layout.tsx` | Loads Cabin (Latin) and Amiri (Arabic) with `next/font`, exposing `--font-cabin` / `--font-arabic` |
| `packages/ui/src/*` | Reusable UI primitives |
| `packages/ui/tailwind.config.ts` / `postcss.config.mjs` | Package-local Tailwind so the UI builds without the app |
| `packages/ui/.storybook/*` | Storybook config (see §10) |

**Import paths**

```ts
import { Button, Card, Container, SectionHeading } from '@itqa/ui'; // primitives
import { colors, fontSize, cssVars } from '@itqasys/core/design';     // raw tokens
```

**Rule:** edit tokens in `tokens.ts`, never hardcode hex values or font stacks in components.

---

## 2. Colour

Defined in `tokens.ts` (`colors`), wired to Tailwind classes as shown. The names follow the
Figma "Color styles" list: `Primary -2` … `Primary 6`. Figma's `Primary -1`/`Primary -2` are
keyed `neg1`/`neg2` in code so classes read `bg-primary-neg1` instead of `bg-primary--1`.

| Token | Value (provisional) | Tailwind class examples | Usage |
| --- | --- | --- | --- |
| `primary-neg2` | `#0B2A36` (Figma `Primary -2`) | `bg-primary-neg2`, `text-primary-neg2` | Header/footer background, headings |
| `primary-neg1` | `#14495C` (Figma `Primary -1`) | `bg-primary-neg1`, `text-primary-neg1` | Section bands, hover, links on light |
| `primary-1` | `#20627B` (Figma `Primary 1`) | `bg-primary-1`, `text-primary-1` | Dark accents |
| `primary-2` | `#2B7A99` (Figma `Primary 2`) | `bg-primary-2`, `text-primary-2` | Links, secondary buttons, focus ring |
| `primary-3` | `#5C99B1` (Figma `Primary 3`) | `bg-primary-3`, `text-primary-3` | Mid tints |
| `primary-4` | `#8DB8C9` (Figma `Primary 4`) | `bg-primary-4`, `text-primary-4` | Light tints |
| `primary-5` | `#BDD7E1` (Figma `Primary 5`) | `border-primary-5`, `bg-primary-5` | Card/panel borders, dividers, on-dark text |
| `primary-6` | `#EEF6F9` (Figma `Primary 6`) | `bg-primary-6` | Page tint, ghost button hover |
| `primary-8` | `#2D6D8A` | `bg-primary-8`, `text-primary-8` | Brand submit button, course/media accents |
| `accent-gold` | `#C9A24B` | `bg-accent-gold`, `text-accent-gold` | Hero ornament, highlights, "gold" buttons |
| `warm-surface` / `warm-ink` / `warm-border` | `#F2EDE4` / `#7A623F` / `#D9CBB7` | `bg-warm-surface`, `text-warm-ink`, `ring-warm-border` | Warm multimedia library headings and carousel arrows |
| `success` | `#2E8B57` | `text-success`, `bg-success/10` | Success form state |
| `danger` | `#C0392B` | `text-danger`, `bg-danger/10` | Error form state |
| `ink` | `#292929` | `border-ink`, `bg-ink` | Playlist card border and shadow |

Tailwind's default `neutral-*` and `slate-*` palettes remain available for body text and
muted copy (the source map's `neutral-900/100` were mapped onto the defaults rather than
overriding the scale).

**Excluded:** the five login colour variants (pink/blue/green/orange/beige) are per-role
*portal* themes and are deliberately kept out of the website package.

### CSS variables

`cssVars` in `tokens.ts` mirrors the `:root` block in `globals.css` (HSL channels, shadcn/ui
compatible). They are consumed by the base layer (`hsl(var(--ring))`, `hsl(var(--background))`,
etc.). If you change a token value, update **both** files.

| Variable | Value |
| --- | --- |
| `--background` / `--foreground` | `0 0% 95%` / `0 0% 7%` |
| `--primary` / `--primary-foreground` | `197 55% 38%` / `0 0% 100%` |
| `--secondary` / `--secondary-foreground` | `195 55% 16%` / `0 0% 100%` |
| `--accent` / `--accent-foreground` | `41 54% 54%` / `0 0% 7%` |
| `--muted` / `--muted-foreground` | `195 40% 95%` / `195 20% 35%` |
| `--border` / `--input` / `--ring` | `195 30% 80%` / `195 30% 80%` / `197 55% 38%` |
| `--success` / `--danger` | `146 50% 36%` / `6 63% 46%` |
| `--radius` | `0.5rem` |

---

## 3. Typography

### Fonts (`next/font/google`, loaded in `app/layout.tsx`)

| Variable | Font | Tailwind class | Used for |
| --- | --- | --- | --- |
| `--font-cabin` | **Cabin** | `font-sans`, `font-heading`, `font-cabin` | All Latin text: body copy, headings, UI |
| `--font-arabic` | **Amiri** | `font-arabic` | Arabic text and subtitles |

Cabin is a variable font and is the single family for all Latin text; `font-sans` and
`font-heading` both map to it. Amiri loads weights `400` and `700` for Arabic/RTL copy.

### Type scale

| Class | Size / line-height / weight (provisional) | Use |
| --- | --- | --- |
| `text-display` | 2.5rem / 1.15 / 700 | Hero title |
| `text-h1` | 2rem / 1.2 / 700 | Page title |
| `text-h2` | 1.5rem / 1.3 / 600 | Section title |
| `text-h3` | 1.125rem / 1.4 / 600 | Card / subsection title |
| `text-body` | 1rem / 1.6 | Paragraphs, buttons |
| `text-small` | 0.875rem / 1.5 | Labels, meta, footer links |

---

## 4. Spacing, radii, shadows, layout

| Token | Tailwind | Value |
| --- | --- | --- |
| Section spacing | `py-section` / `py-section-sm` | `4rem` / `2.5rem` |
| Page width | `max-w-page` | `1200px` |
| Card radius | `rounded-card` | `0.5rem` |
| Card shadow | `shadow-card` | subtle primary-tinted shadow |
| Playlist card shadow | `shadow-playlist-card` | `#292929` shadow for the playlist fan |
| Warm card shadow | `shadow-warm-card` | warm-tinted shadow for the library headings |
| Breakpoints | `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536 | standard |

Page structure: wrap content in `Container` (`max-w-page` + responsive `px-4 sm:px-6`), then a
vertical section with `py-section-sm` (or `py-section` for large bands).

### Gradients

Section and card gradients live in `gradients` (`tokens.ts`) and are mapped to Tailwind's
`backgroundImage`, so components use `bg-<name>` instead of inline `linear-gradient(...)`:

| Token | Tailwind class | Used by |
| --- | --- | --- |
| `courses-section` | `bg-courses-section` | `FeaturedCourses` band |
| `course-card` | `bg-course-card` | `CourseCard` overlay |
| `media-library` | `bg-media-library` | `MediaLibrary` (multimedia videos/links) |

---

## 5. UI primitives (`packages/website/src/ui`)

All primitives are server-safe (no hooks) and theme entirely through tokens.

### `Container` (alias `PageContainer`)
`{ children, className? }` — centered `max-w-page` container with responsive padding.

### `SectionHeading`
`{ title, subtitle?, arabicSubtitle?, align?: 'left'|'center', as?: 'h1'|'h2'|'h3', className? }`
Renders a heading; `arabicSubtitle` is output `dir="rtl" lang="ar"` with `font-arabic`.

### `Button` / `ButtonLink`
Variants follow the Figma "Primary button" sheet (Style 1–3), plus `brand` and `gold`:
- `primary` (default, Style 1) — solid dark: `bg-primary-neg2 text-white`, hover `primary-neg1`
- `secondary` (Style 2) — white with a light border: `border-primary-5 bg-white text-primary-neg1`, hover `primary-6`
- `tertiary` (Style 3) — light tonal fill: `bg-primary-5 text-primary-neg1`, hover `primary-4`
- `brand` — brand teal submit: `bg-primary-8 text-white`, hover `primary-1`
- `gold` — accent for hero/CTA highlights: `bg-accent-gold text-primary-neg2`
- `size`: `sm` · `md` (default) · `lg`
- `Button` accepts native `<button>` props; `ButtonLink` accepts `<a>` props plus required `href`.
- `buttonClasses({ variant, size, className })` returns the class string for custom elements.

### Form controls
`Label`, `Input`, `Textarea`, `Select` wrap native elements with `fieldClasses()` styling
(`rounded-card`, `border-primary-5`, primary focus). Idiomatic usage:

```tsx
<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" name="email" type="email" required className="mt-1" />
</div>
```

### `Card`
`{ children, className? }` — `rounded-card border-primary-5 bg-white shadow-card p-5`.

### `Badge`
`{ tone?: 'primary'|'gold'|'success'|'danger', className? }` — small pill; default `primary`.

### `Notice`
`{ title?, tone?: 'info'|'gold', children, className? }` — token-styled callout for contextual
help or registration information. `info` uses `bg-primary-6`; `gold` uses the accent tint.

---

## 6. Component map

| Component | Location | Consumes |
| --- | --- | --- |
| `SiteHeader`, `SiteFooter` | `packages/website/src/layout/SiteChrome.tsx` | `Container`, primary tokens, `accent-gold` |
| `Home`, `Text`, `FeaturedCourses`, `Multimedia`, `FeaturedResources`, `Cta` | `packages/website/src/sections/<name>/` | `Container`, `SectionHeading`, `Card`, `ButtonLink` |
| `SectionRenderer`, `PageView` / `WebsiteLanding` | `packages/website/src/sections/SectionRenderer.tsx`, `PageView.tsx` | maps `Section.type` → section component |
| `Carousel` | `packages/website/src/sections/shared/carousel/` | one API: `fade` banner, `scroll` rows (hidden scrollbar), `playlist` fan |
| Courses list/detail, Contact, admin editor | `apps/frontend/app/**` | primitives above |

`SectionRenderer` maps the CMS `Section.type` (`HOME`, `TEXT`, `FEATURED_COURSES`,
`MULTIMEDIA`, `FEATURED_RESOURCES`, `CTA`) to a component, so editors can reorder/edit sections without a redeploy.

---

## 7. Conventions

- **RTL / Arabic:** use `dir="rtl"` and `lang="ar"` with `font-arabic` for Arabic copy.
  The type scale is shared; no separate Arabic scale yet.
- **Focus & contrast:** a global `:focus-visible` ring uses `--ring` (primary-2). Keep white text
  on `primary-2`+ and gold-on-dark at WCAG AA or better when replacing provisional colours.
- **New value?** If a one-off colour/size appears twice, promote it to a token in `tokens.ts`
  rather than repeating a utility.
- **No comments needed:** components communicate intent through token names.

---

## 8. Maintenance checklist

Carried over from the source map (§1.5):

- [ ] Export colours and text styles from Figma (Variables or Dev Mode)
- [ ] Replace provisional values in `tokens.ts` (and mirror any change in `globals.css`)
- [ ] Verify contrast: white on `primary-2` and gold on dark meet WCAG AA
- [ ] Confirm spacing and breakpoints against the Figma desktop + mobile widths
- [ ] Confirm the Latin heading/body fonts and the Arabic font from Figma text styles
- [ ] Keep tokens in `packages/core` so the eventual portals can reuse them

## 9. Out of scope

- Login per-role portal themes (admin, coordinator, teacher, student, parent)
- Study Materials, Articles and Digital Library screens (Phase 7)
- Rich-text (Tiptap), drag-and-drop ordering and image upload editors

## 10. Storybook (package-local preview)

The UI can be developed and tested from `packages/ui` alone — no Next.js app required.

```bash
pnpm storybook            # root helper -> packages/ui, http://localhost:6006
pnpm build-storybook      # static build -> packages/ui/storybook-static
# or directly:
pnpm --filter @itqa/ui storybook
```

| File | Role |
| --- | --- |
| `packages/ui/.storybook/main.ts` | Framework (`@storybook/react-vite`), stories globs, addons (docs, a11y, links) |
| `packages/ui/.storybook/preview.ts` | Global parameters; imports the preview stylesheet |
| `packages/ui/.storybook/preview.css` | Tailwind entry + `:root` vars + base layer (mirrors `apps/frontend/app/globals.css`) |
| `packages/ui/.storybook/preview-head.html` | Loads Cabin / Amiri and sets `--font-*` |
| `packages/ui/tailwind.config.ts` | Package Tailwind theme built from the shared tokens |

Stories live beside the components as `src/**/*.stories.tsx` and use `tags: ['autodocs']`:

- **Primitives:** Button, Input, Textarea, Select, Label, Card, Badge, SectionHeading, Container
- **Sections:** Home, Text, FeaturedCourses, Multimedia, FeaturedResources, CallToAction (via `SectionRenderer`)
- **Layout:** Site header, footer

To add a story, create `X.stories.tsx` next to `X.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { X } from './X';

const meta = { title: 'Primitives/X', component: X, tags: ['autodocs'] } satisfies Meta<typeof X>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
```

The a11y addon runs on every story (set to `todo` while token colours are provisional, so
violations are reported but do not fail the preview).
