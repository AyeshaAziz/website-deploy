import type { CourseDTO } from '../model/courses';

export const FALLBACK_COURSES: CourseDTO[] = [
  {
    id: 'home-naziratul-quran',
    urlPath: 'naziratul-quran',
    title: "Naziratul-Qur'an",
    summary: 'Recitation',
    description: "Read the Qur'an fluently with correct pronunciation under teacher guidance.",
    imageUrl: '/images/courses/naziratul-quran.png',
  },
  {
    id: 'home-yassarnal-quran',
    urlPath: 'yassarnal-quran',
    title: "Yassarnal-Qur'an",
    summary: 'Qaidah',
    description: 'A gentle foundation course for beginners learning to read the Qur’an.',
    imageUrl: '/images/courses/yassarnal-quran.png',
  },
  {
    id: 'home-tafsirul-quran',
    urlPath: 'tafsirul-quran',
    title: "Tafsirul-Qur'an",
    summary: 'Interpretation',
    description: 'Understand the meanings and context of the Qur’anic verses.',
    imageUrl: '/images/courses/tafsirul-quran.png',
  },
  {
    id: 'home-qawaidul-quran',
    urlPath: 'qawaidul-quran',
    title: "Qawaidul-Qur'an",
    summary: 'Grammar',
    description: 'Learn the Arabic grammar needed to understand Qur’anic Arabic.',
    imageUrl: '/images/courses/qawaidul-quran.png',
  },
  {
    id: 'home-tarjamatul-quran',
    urlPath: 'tarjamatul-quran',
    title: "Tarjamatul-Qur'an",
    summary: 'Translation',
    description: 'Translate Qur’anic Arabic accurately with structured practice.',
    imageUrl: '/images/courses/tarjamatul-quran.png',
  },
];
