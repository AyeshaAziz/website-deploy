import { TANZEEM_OPTIONS, type Tanzeem } from '@itqasys/core';

export const ATFAL_NASIRAT_TANZEEM = [
  'atfal-7-11',
  'nasirat-7-11',
  'atfal-12-15',
  'nasirat-12-15',
  'boy-5-7',
  'girl-5-7',
] as const satisfies readonly Tanzeem[];

export const REGISTRATION_GROUPS = {
  ansar: ['ansar'],
  khuddam: ['khuddam'],
  lajna: ['lajna'],
  'atfal-nasirat': ATFAL_NASIRAT_TANZEEM,
} as const satisfies Record<string, readonly Tanzeem[]>;

export type RegistrationGroup = keyof typeof REGISTRATION_GROUPS;

export interface RegistrationGroupSelection {
  allowed: readonly Tanzeem[];
  tanzeem?: Tanzeem;
}

export function isRegistrationGroup(value: unknown): value is RegistrationGroup {
  return (
    typeof value === 'string' && Object.prototype.hasOwnProperty.call(REGISTRATION_GROUPS, value)
  );
}

export function resolveRegistrationGroup(group?: string): RegistrationGroupSelection {
  if (!isRegistrationGroup(group)) {
    return { allowed: TANZEEM_OPTIONS };
  }

  const allowed = REGISTRATION_GROUPS[group];
  return { allowed, tanzeem: allowed[0] };
}
