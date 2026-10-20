import type { ReactNode } from 'react';
import { Container } from '../../ui/Container';
import type { AboutStat } from './about.types';

function StatRow({ stat }: { stat: AboutStat }): ReactNode {
  return (
    <li className="flex items-center gap-4 py-4 sm:gap-6">
      <img
        src={`/icons/${stat.icon}.png`}
        alt=""
        aria-hidden="true"
        className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
      />
      <div className="min-w-0">
        <h3 className="font-cabin text-h3 font-bold text-primary-7">{stat.title}</h3>
        <p className="text-small text-neutral-600">{stat.caption}</p>
      </div>
    </li>
  );
}

export function StatsList({ stats }: { stats: AboutStat[] }): ReactNode {
  return (
    <Container>
      <ul className="bg-accent-light_gray pl-8">
        {stats.map((stat) => (
          <StatRow key={stat.title} stat={stat} />
        ))}
      </ul>
    </Container>
  );
}
