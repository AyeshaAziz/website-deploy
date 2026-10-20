/**
 * ITQA design tokens — single source of truth.
 *
 * Derived from `ITQA_Design_Tokens_and_Screen_Map.md` (Part 1) and the Figma
 * "Color styles" list (`Primary -2` … `Primary 6`).
 *
 * NOTE: values marked `provisional` are estimated/interpolated from the Figma
 * overview and MUST be replaced with the exact Figma Variables / Dev Mode
 * export before launch. Login per-role portal themes (pink/blue/green/orange/
 * beige) are intentionally excluded from the website tokens.
 *
 * Rule of thumb: edit tokens here, never hardcode hex values in components.
 */

/**
 * Figma names `Primary -2`/`Primary -1` map to the code keys `neg2`/`neg1`
 * (a literal `-` would produce awkward Tailwind classes like `bg-primary--2`).
 */
export type PrimaryShade = 'neg2' | 'neg1' | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const colors: {
  primary: Record<PrimaryShade, string>;
  accent: { gold: string; olive: string; gray: string; light_gray: string };
  success: string;
  danger: string;
} = {
  primary: {
    neg2: '#052D39',
    neg1: '#114656',
    1: '#18647A', 
    2: '#478A9E', 
    3: '#73B2C5', 
    4: '#ACDAE9', 
    5: '#D5E8EE', 
    6: '#DCECF1',
    7: '#002333',
  },
  accent: {
    gold: '#C9A24B',
    olive: '#82927F',
    gray: '#C4C4C4',
    light_gray: '#F1F1F1',
  },
  success: '#2E8B57', 
  danger: '#C0392B',
};

/** Font families resolve to CSS variables set by `next/font` in the app layout. */
export const fontFamily = {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  heading: ['var(--font-heading)', 'Georgia', 'serif'],
  cabin: ['var(--font-cabin)', 'system-ui', 'sans-serif'],
  arabic: ['var(--font-arabic)', 'serif'],
};

/** Provisional type scale — confirm line heights and weights against Figma. */
export const fontSize: Record<
  string,
  [string, { lineHeight: string; fontWeight?: string }]
> = {
  display: ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }],
  h1: ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
  h2: ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
  h3: ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
  body: ['1rem', { lineHeight: '1.6' }],
  small: ['0.875rem', { lineHeight: '1.5' }],
};

export const spacing = {
  section: '4rem',
  'section-sm': '2.5rem',
};

export const maxWidth = {
  page: '1200px',
};

export const borderRadius = {
  card: '0.5rem',
};

export const boxShadow = {
  card: '0 1px 2px rgba(11, 42, 54, 0.08), 0 1px 3px rgba(11, 42, 54, 0.06)',
  header: '0 2px 4px rgba(11, 42, 54, 0.16), 0 4px 12px rgba(11, 42, 54, 0.12)',
};

/** Desktop plus a single mobile width are shown in Figma; use standard breakpoints. */
export const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * shadcn/ui-compatible CSS custom properties (HSL channels, no `hsl()` wrapper).
 * Injected into `:root` by `apps/frontend/app/globals.css`.
 */
export const cssVars: Record<string, string> = {
  '--background': '0 0% 95%',
  '--foreground': '0 0% 7%',
  '--card': '0 0% 100%',
  '--card-foreground': '0 0% 7%',
  '--primary': '197 55% 38%', // primary-2
  '--primary-foreground': '0 0% 100%',
  '--secondary': '195 55% 16%', // primary-neg1
  '--secondary-foreground': '0 0% 100%',
  '--accent': '41 54% 54%', // accent-gold
  '--accent-foreground': '0 0% 7%',
  '--muted': '195 40% 95%', // primary-6
  '--muted-foreground': '195 20% 35%',
  '--border': '195 30% 80%',
  '--input': '195 30% 80%',
  '--ring': '197 55% 38%', // primary-2
  '--success': '146 50% 36%',
  '--danger': '6 63% 46%',
  '--radius': '0.5rem',
};

export const tokens = {
  colors,
  fontFamily,
  fontSize,
  spacing,
  maxWidth,
  borderRadius,
  boxShadow,
  screens,
  cssVars,
};
