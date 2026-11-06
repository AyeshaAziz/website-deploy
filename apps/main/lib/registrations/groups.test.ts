import { describe, expect, it } from 'vitest';
import { TANZEEM_OPTIONS } from '@itqasys/core';
import { ATFAL_NASIRAT_TANZEEM, resolveRegistrationGroup } from './groups';

describe('registration groups', () => {
  it('returns every tanzeem when no group is provided', () => {
    const { allowed, tanzeem } = resolveRegistrationGroup();

    expect(allowed).toHaveLength(TANZEEM_OPTIONS.length);
    expect(tanzeem).toBeUndefined();
  });

  it('maps a single tanzeem group to only that option', () => {
    const { allowed, tanzeem } = resolveRegistrationGroup('khuddam');

    expect(allowed).toEqual(['khuddam']);
    expect(tanzeem).toBe('khuddam');
  });

  it('maps the atfal-nasirat group and preselects the first age group', () => {
    const { allowed, tanzeem } = resolveRegistrationGroup('atfal-nasirat');

    expect(allowed).toEqual(ATFAL_NASIRAT_TANZEEM);
    expect(tanzeem).toBe('atfal-7-11');
  });

  it('ignores unknown groups', () => {
    const { allowed, tanzeem } = resolveRegistrationGroup('unknown');

    expect(allowed).toHaveLength(TANZEEM_OPTIONS.length);
    expect(tanzeem).toBeUndefined();
  });
});
