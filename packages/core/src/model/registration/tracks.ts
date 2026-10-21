export const REGISTRATION_TRACKS = [
  'atfalNasirat',
  'ansar',
  'khuddam',
  'lajna',
  'teacher',
] as const;

export type RegistrationTrack = (typeof REGISTRATION_TRACKS)[number];

export function isRegistrationTrack(value: unknown): value is RegistrationTrack {
  return (
    typeof value === 'string' &&
    (REGISTRATION_TRACKS as readonly string[]).includes(value)
  );
}
