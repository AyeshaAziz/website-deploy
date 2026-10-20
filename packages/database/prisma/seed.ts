import bcrypt from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type SeedSection = { type: Prisma.SectionCreateWithoutPageInput['type']; content: Prisma.InputJsonObject };

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD');

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, role: 'ADMIN', passwordHash: await bcrypt.hash(password, 12) },
  });

  const courses = [
    { slug: 'sample-course-one', title: 'Sample Course One', summary: 'Placeholder course summary.' },
    { slug: 'sample-course-two', title: 'Sample Course Two', summary: 'Another placeholder course.' },
  ];
  for (const [i, c] of courses.entries()) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, status: 'PUBLISHED', sortOrder: i },
    });
  }

  if ((await prisma.resource.count()) === 0) {
    await prisma.resource.create({
      data: {
        title: 'Sample study material',
        url: 'https://example.com',
        description: 'Placeholder resource.',
        status: 'PUBLISHED',
      },
    });
  }

  const pages: Array<{ slug: string; title: string; sections: SeedSection[] }> = [
    {
      slug: 'home',
      title: 'Home',
      sections: [
        { type: 'HERO', content: { heading: 'Welcome to ITQA', subheading: 'Placeholder hero text.', ctaLabel: 'View courses', ctaHref: '/courses' } },
        { type: 'FEATURED_COURSES', content: { heading: 'Featured courses' } },
        { type: 'FEATURED_RESOURCES', content: { heading: 'Study materials' } },
        { type: 'CTA', content: { heading: 'Get in touch', label: 'Contact us', href: '/contact' } },
      ],
    },
    {
      slug: 'about',
      title: 'About',
      sections: [{ type: 'TEXT', content: { heading: 'About ITQA', body: 'Placeholder about text.\n\nSecond paragraph.' } }],
    },
    {
      slug: 'study-materials',
      title: 'Study Materials',
      sections: [{ type: 'FEATURED_RESOURCES', content: { heading: 'Study materials' } }],
    },
  ];

  for (const p of pages) {
    const page = await prisma.websitePage.upsert({
      where: { slug: p.slug },
      update: {},
      create: { slug: p.slug, title: p.title, status: 'PUBLISHED', publishedAt: new Date() },
    });
    if ((await prisma.section.count({ where: { pageId: page.id } })) === 0) {
      await prisma.section.createMany({
        data: p.sections.map((s, order) => ({ pageId: page.id, type: s.type, order, content: s.content })),
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
