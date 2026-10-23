'use client';

import { useEffect } from 'react';

const EXTENSION_ATTRIBUTE_PATTERNS = [
  /^data-gr-/i,
  /^data-new-gr-c-s-check-loaded$/i,
  /^data-gramm/i,
];

function isExtensionAttribute(name: string): boolean {
  return EXTENSION_ATTRIBUTE_PATTERNS.some((pattern) => pattern.test(name));
}

function stripExtensionAttributes(element: Element): void {
  for (const { name } of Array.from(element.attributes)) {
    if (isExtensionAttribute(name)) element.removeAttribute(name);
  }
}

export function ExtensionAttributeGuard(): null {
  useEffect(() => {
    const targets = [document.documentElement, document.body];

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const name = mutation.attributeName;
        const target = mutation.target;
        if (
          mutation.type === 'attributes' &&
          name &&
          target instanceof Element &&
          isExtensionAttribute(name)
        ) {
          target.removeAttribute(name);
        }
      }
    });

    for (const target of targets) {
      observer.observe(target, { attributes: true });
      stripExtensionAttributes(target);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
