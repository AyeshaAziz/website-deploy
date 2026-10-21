import type { CourseDTO } from '@itqa/core';

/**
 * Frontend-only fallback used when the database is unavailable or no courses
 * are published yet. The same five courses are created by the Prisma seed, so
 * the CMS can take over without a UI change.
 */
export const HOME_COURSES: CourseDTO[] = [
  {
    id: 'home-naziratul-quran',
    urlPath: 'naziratul-quran',
    title: "Naziratul-Qur'an",
    summary: 'Recitation',
    description: null,
    imageUrl: '/images/courses/naziratul-quran.png',
  },
  {
    id: 'home-yassarnal-quran',
    urlPath: 'yassarnal-quran',
    title: "Yassarnal-Qur'an",
    summary: 'Qaidah',
    description: null,
    imageUrl: '/images/courses/yassarnal-quran.png',
  },
  {
    id: 'home-tafsirul-quran',
    urlPath: 'tafsirul-quran',
    title: "Tafsirul-Qur'an",
    summary: 'Interpretation',
    description: null,
    imageUrl: '/images/courses/tafsirul-quran.png',
  },
  {
    id: 'home-qawaidul-quran',
    urlPath: 'qawaidul-quran',
    title: "Qawaidul-Qur'an",
    summary: 'Grammar',
    description: null,
    imageUrl: '/images/courses/qawaidul-quran.png',
  },
  {
    id: 'home-tarjamatul-quran',
    urlPath: 'tarjamatul-quran',
    title: "Tarjamatul-Qur'an",
    summary: 'Translation',
    description: null,
    imageUrl: '/images/courses/tarjamatul-quran.png',
  },
];
