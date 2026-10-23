import { TANZEEM_OPTIONS, type Tanzeem } from '@itqa/core';

export const REGISTRATION_GROUPS = {
  ansar: ['ansar'],
  khuddam: ['khuddam'],
  lajna: ['lajna'],
  'atfal-nasirat': ['atfal', 'nasirat'],
} as const satisfies Record<string, readonly Tanzeem[]>;

export type RegistrationGroup = keyof typeof REGISTRATION_GROUPS;

export interface RegistrationGroupSelection {
  allowed: readonly Tanzeem[];
  tanzeem?: Tanzeem;
}

export function isRegistrationGroup(value: unknown): value is RegistrationGroup {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(REGISTRATION_GROUPS, value)
  );
}

export function resolveRegistrationGroup(
  group?: string,
): RegistrationGroupSelection {
  if (!isRegistrationGroup(group)) {
    return { allowed: TANZEEM_OPTIONS };
  }

  const allowed = REGISTRATION_GROUPS[group];
  return { allowed, tanzeem: allowed[0] };
}
