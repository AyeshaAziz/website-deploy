import type { ReactNode } from 'react';
import { IntroCards } from './IntroCards';
import { StatsList } from './StatsList';
import { UsefulLinks } from './UsefulLinks';
import { ABOUT_CONTENT } from './data';
import type { AboutContent } from './about.types';

export function AboutSections({ content = ABOUT_CONTENT }: { content?: AboutContent }): ReactNode {
  return (
    <div className="space-y-8 bg-white py-8 sm:space-y-10 sm:py-12">
      <IntroCards {...content.intro} />
      <StatsList stats={content.stats} />
      <UsefulLinks {...content.usefulLinks} />
    </div>
  );
}
