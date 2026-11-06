# ITQA Website: Design Tokens and Screen Map

Source: Figma file "ITQA Design System" plus Home, About, Courses, Teachers and login screens.
Scope: public website only (`@itqa/website`), per the Day 1 plan.

> **Verify before use.** The design-system frame was too small to read in the screenshot. All colour hex values, font names and sizes below are **provisional**, estimated from the overview. Replace them with exact values from Figma (Dev Mode or Variables export) before building.

---

## Part 1: Tailwind theme and tokens

### 1.1 Colour tokens (provisional)

| Token | Provisional value | Seen in |
| --- | --- | --- |
| `brand-900` | `#0B2A36` | Header and footer background (dark teal) |
| `brand-700` | `#14495C` | Section bands, hover states |
| `brand-500` | `#2B7A99` | Links, secondary buttons |
| `brand-200` | `#BFDDE8` | Cards, light panels |
| `brand-50` | `#EEF6F9` | Page tint |
| `neutral-900` | `#111111` | Hero background, body text |
| `neutral-100` | `#F2F2F2` | Page background |
| `accent-gold` | `#C9A24B` | Hero ornament, highlights |
| `success` / `danger` | `#2E8B57` / `#C0392B` | Form states |

The login screens use five colour variants (pink, blue, green, orange, beige). Treat these as per-role portal themes (admin, coordinator, teacher, student, parent), **not** website tokens. Keep them out of the website package.

### 1.2 `tailwind.config.ts` (in `packages/core`)

```ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{ts,tsx}',
    './packages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF6F9',
          200: '#BFDDE8',
          500: '#2B7A99',
          700: '#14495C',
          900: '#0B2A36',
        },
        accent: { gold: '#C9A24B' },
      },
      fontFamily: {
        sans: ['var(--font-cabin)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-cabin)', 'system-ui', 'sans-serif'],
        cabin: ['var(--font-cabin)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'serif'],
      },
      fontSize: {
        // provisional scale: confirm against Figma
        'display': ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
      maxWidth: { page: '1200px' },
      borderRadius: { card: '0.5rem' },
    },
  },
} satisfies Config;
```

### 1.3 CSS variables (shadcn/ui compatible)

```css
:root {
  --background: 0 0% 95%;
  --foreground: 0 0% 7%;
  --primary: 197 55% 38%;        /* brand-500 */
  --primary-foreground: 0 0% 100%;
  --secondary: 195 55% 16%;      /* brand-700 */
  --muted: 195 40% 95%;          /* brand-50 */
  --border: 195 30% 80%;
  --radius: 0.5rem;
}
```

### 1.4 Fonts

- Load with `next/font` and expose `--font-cabin` (Cabin) and `--font-arabic` (Amiri).
- Cabin is the single font for all Latin text (body, headings, UI); the `font-sans`, `font-heading` and `font-cabin` utilities all resolve to it.
- Amiri covers Arabic/RTL text and subtitles.
- Confirm font weights and sizes from the Figma text styles.

### 1.5 Token handover checklist

- [ ] Export colours and text styles from Figma (Variables or Dev Mode)
- [ ] Replace provisional values above
- [ ] Check contrast: white text on `brand-500` and gold on dark must meet WCAG AA
- [ ] Define spacing and breakpoints (the Figma shows desktop and a single mobile width)
- [ ] Put tokens in `packages/core`, consumed by both `@itqa/website` and the portals

---

## Part 2: Figma screen to component and page map

### 2.1 Pages

| Figma frame | Route | Rendering | Notes |
| --- | --- | --- | --- |
| Desktop/Home (+ mobile) | `/` | ISR, `revalidate = 3600` | Hero plus featured courses and resources, CMS-driven |
| About | `/about` | ISR | Intro text, founder panel, team list |
| Courses | `/courses` | ISR | Course directory, course cards |
| Teachers | `/teachers` | ISR | Teacher listing and enquiry/contact form |
| Login screens (5 colour variants) | `/login` | Client component | Out of website scope. Build one layout, theme per role later |

### 2.2 Shared layout components (`packages/ui` + `@itqa/website`)

| Component | Used on | Notes |
| --- | --- | --- |
| `SiteHeader` | All pages | Dark teal bar, logo, nav, mobile menu |
| `SiteFooter` | All pages | Three link columns (About ITQA, Help Desk, Connect) plus a logo or map block |
| `PageContainer` | All pages | `max-w-page`, responsive padding |
| `SectionHeading` | All pages | Title with optional Arabic subtitle |
| `Button`, `Input`, `Textarea`, `Select` | Forms | shadcn/ui, themed by tokens |

### 2.3 Website components (`@itqa/website`)

| Component | Maps to CMS section type | Page |
| --- | --- | --- |
| `Hero` | `HOME` | Home |
| `TextBlock` | `TEXT` | About, Home |
| `FeaturedCourses` | `FEATURED_COURSES` | Home |
| `FeaturedResources` | `FEATURED_RESOURCES` | Home |
| `CallToAction` | `CTA` | Home, Courses |
| `CourseCard` | n/a (data-driven) | Home, Courses |
| `CourseGrid` | n/a | Courses |
| `TeacherCard` / `TeacherList` | n/a | Teachers |
| `QuoteBlock` | `TEXT` variant | About |
| `ContactForm` | n/a (Server Action) | Teachers |
| `SectionRenderer` | maps `Section.type` to component | All CMS pages |

`SectionRenderer` is the key piece for WEB-02. It reads sections from the database and picks the component, so editors can reorder and edit sections with no redeploy.

### 2.4 Suggested build order

1. Tokens, Tailwind config and fonts in `packages/core`
2. `SiteHeader`, `SiteFooter`, `PageContainer`
3. `SectionRenderer` with `Hero` and `TextBlock`
4. Home page (ISR) with `FeaturedCourses`
5. Courses page with `CourseCard` and `CourseGrid`
6. About page with `QuoteBlock`
7. Teachers page with `ContactForm` and Server Action
8. Mobile pass and accessibility check (including RTL for Arabic text)

### 2.5 Gaps to confirm with design

- Only Home has mobile frames. Confirm mobile designs for About, Courses and Teachers.
- No visible states for forms (error, loading, success).
- No Study Materials, Articles or Digital Library screens (these are Phase 7 in the roadmap).
- Confirm whether the login screens belong in the website package or the portals package.
