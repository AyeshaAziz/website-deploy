export const TANZEEM_OPTIONS = [
  'boy-5-7',
  'girl-5-7',
  'atfal-7-11',
  'nasirat-7-11',
  'atfal-12-15',
  'nasirat-12-15',
  'khuddam',
  'lajna',
  'ansar',
  'special-needs',
  'missionary',
] as const;

export type Tanzeem = (typeof TANZEEM_OPTIONS)[number];
