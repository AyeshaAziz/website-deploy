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

  await prisma.course.deleteMany({
    where: { urlPath: { in: ['sample-course-one', 'sample-course-two'] } },
  });

  const courses = [
    {
      urlPath: 'naziratul-quran',
      title: "Naziratul-Qur'an",
      summary: 'Recitation',
      description: "Read the Qur'an fluently with correct pronunciation under teacher guidance.",
      imageUrl: '/images/courses/naziratul-quran.png',
    },
    {
      urlPath: 'yassarnal-quran',
      title: "Yassarnal-Qur'an",
      summary: 'Qaidah',
      description: 'A gentle foundation course for beginners learning to read the Qur’an.',
      imageUrl: '/images/courses/yassarnal-quran.png',
    },
    {
      urlPath: 'tafsirul-quran',
      title: "Tafsirul-Qur'an",
      summary: 'Interpretation',
      description: 'Understand the meanings and context of the Qur’anic verses.',
      imageUrl: '/images/courses/tafsirul-quran.png',
    },
    {
      urlPath: 'qawaidul-quran',
      title: "Qawaidul-Qur'an",
      summary: 'Grammar',
      description: 'Learn the Arabic grammar needed to understand Qur’anic Arabic.',
      imageUrl: '/images/courses/qawaidul-quran.png',
    },
    {
      urlPath: 'tarjamatul-quran',
      title: "Tarjamatul-Qur'an",
      summary: 'Translation',
      description: 'Translate Qur’anic Arabic accurately with structured practice.',
      imageUrl: '/images/courses/tarjamatul-quran.png',
    },
  ];
  for (const [i, c] of courses.entries()) {
    await prisma.course.upsert({
      where: { urlPath: c.urlPath },
      update: { ...c, status: 'PUBLISHED', sortOrder: i, archivedAt: null },
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

  const pages: Array<{ urlPath: string; title: string; sections: SeedSection[] }> = [
    {
      urlPath: 'home',
      title: 'Home',
      sections: [
        { type: 'FEATURED_COURSES', content: { heading: 'ITQA COURSES' } },
        { type: 'MULTIMEDIA', content: {} },
        { type: 'FEATURED_RESOURCES', content: { heading: 'Study materials' } },
        { type: 'CTA', content: { heading: 'Get in touch', label: 'Contact us', href: '/contact' } },
      ],
    },
    {
      urlPath: 'about',
      title: 'About',
      sections: [{ type: 'TEXT', content: { heading: 'About ITQA', body: 'Placeholder about text.\n\nSecond paragraph.' } }],
    },
    {
      urlPath: 'study-materials',
      title: 'Study Materials',
      sections: [{ type: 'FEATURED_RESOURCES', content: { heading: 'Study materials' } }],
    },
  ];

  for (const p of pages) {
    const page = await prisma.websitePage.upsert({
      where: { urlPath: p.urlPath },
      update: {},
      create: { urlPath: p.urlPath, title: p.title, status: 'PUBLISHED', publishedAt: new Date() },
    });
    // The home layout is seeded as a fixed baseline so the new HOME section
    // order lands on existing databases too.
    if (p.urlPath === 'home') {
      await prisma.section.deleteMany({ where: { pageId: page.id } });
      await prisma.section.createMany({
        data: p.sections.map((s, order) => ({ pageId: page.id, type: s.type, order, content: s.content })),
      });
    } else if ((await prisma.section.count({ where: { pageId: page.id } })) === 0) {
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
