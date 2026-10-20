import type { ReactNode } from 'react';
import aboutData from './about.json';
import { IntroCards } from './IntroCards';
import { StatsList } from './StatsList';
import { UsefulLinks } from './UsefulLinks';
import type { AboutContent } from './about.types';

const DEFAULT_CONTENT = aboutData as unknown as AboutContent;

export function AboutSections({ content = DEFAULT_CONTENT }: { content?: AboutContent }): ReactNode {
  return (
    <div className="space-y-8 bg-white py-8 sm:space-y-10 sm:py-12">
      <IntroCards {...content.intro} />
      <StatsList stats={content.stats} />
      <UsefulLinks {...content.usefulLinks} />
    </div>
  );
}
