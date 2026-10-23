export const TANZEEM_OPTIONS = [
  'atfal',
  'nasirat',
  'khuddam',
  'lajna',
  'ansar',
] as const;

export type Tanzeem = (typeof TANZEEM_OPTIONS)[number];
