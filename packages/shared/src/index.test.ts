import { describe, expect, it } from 'vitest';
import { cn, str } from './index';

describe('shared utils', () => {
  it('cn joins truthy classes', () => {
    expect(cn('a', false, null, 'b')).toBe('a b');
  });
  it('str falls back for non-strings', () => {
    expect(str(42, 'x')).toBe('x');
    expect(str('hi')).toBe('hi');
  });
});
