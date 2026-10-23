import { describe, expect, it } from 'vitest';
import { resolveRegistrationGroup } from './groups';

describe('registration groups', () => {
  it('returns every tanzeem when no group is provided', () => {
    const { allowed, tanzeem } = resolveRegistrationGroup();

    expect(allowed).toHaveLength(5);
    expect(tanzeem).toBeUndefined();
  });

  it('maps a single tanzeem group to only that option', () => {
    const { allowed, tanzeem } = resolveRegistrationGroup('khuddam');

    expect(allowed).toEqual(['khuddam']);
    expect(tanzeem).toBe('khuddam');
  });

  it('maps the atfal-nasirat group and preselects atfal', () => {
    const { allowed, tanzeem } = resolveRegistrationGroup('atfal-nasirat');

    expect(allowed).toEqual(['atfal', 'nasirat']);
    expect(tanzeem).toBe('atfal');
  });

  it('ignores unknown groups', () => {
    const { allowed, tanzeem } = resolveRegistrationGroup('unknown');

    expect(allowed).toHaveLength(5);
    expect(tanzeem).toBeUndefined();
  });
});
