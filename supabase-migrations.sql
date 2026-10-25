-- ============================================================
-- Supabase Migrations for ITQA Website (idempotent)
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Drop existing policies first (to avoid recursion issues)
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public read published courses" ON public.courses;
DROP POLICY IF EXISTS "Admins manage courses" ON public.courses;
DROP POLICY IF EXISTS "Users read own registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins read all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users insert own registration" ON public.registrations;

-- Drop existing function and trigger (CASCADE handles dependencies)
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 1. Create profiles table (extends auth.users) - IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create courses table (matching Prisma schema) - IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  url_path TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS courses_status_sort_idx ON public.courses (status, sort_order);

-- 3. Create registrations table - IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.registrations (
  id BIGSERIAL PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('teacher', 'student')),
  aims_no TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  tanzeem TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  course TEXT NOT NULL,
  course_language TEXT NOT NULL,
  second_language TEXT,
  teaching_experience TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS registrations_user_id_idx ON public.registrations (user_id);
CREATE INDEX IF NOT EXISTS registrations_reference_idx ON public.registrations (reference);
CREATE INDEX IF NOT EXISTS registrations_idempotency_key_idx ON public.registrations (idempotency_key);

-- 4. Enable Row Level Security (idempotent)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 5. Helper function to check admin role (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 6. RLS Policies for profiles
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 7. RLS Policies for courses
CREATE POLICY "Public read published courses" ON public.courses
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL USING (public.is_admin());

-- 8. RLS Policies for registrations
CREATE POLICY "Users read own registrations" ON public.registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins read all registrations" ON public.registrations
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users insert own registration" ON public.registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'student')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Seed courses (upsert)
INSERT INTO public.courses (id, url_path, title, summary, description, image_url, status, sort_order) VALUES
  ('course_naziratul_quran', 'naziratul-quran', 'Naziratul-Qur''an', 'Recitation', 'Read the Qur''an fluently with correct pronunciation under teacher guidance.', '/images/courses/naziratul-quran.png', 'PUBLISHED', 0),
  ('course_yassarnal_quran', 'yassarnal-quran', 'Yassarnal-Qur''an', 'Qaidah', 'A gentle foundation course for beginners learning to read the Qur''an.', '/images/courses/yassarnal-quran.png', 'PUBLISHED', 1),
  ('course_tafsirul_quran', 'tafsirul-quran', 'Tafsirul-Qur''an', 'Interpretation', 'Understand the meanings and context of the Qur''anic verses.', '/images/courses/tafsirul-quran.png', 'PUBLISHED', 2),
  ('course_qawaidul_quran', 'qawaidul-quran', 'Qawaidul-Qur''an', 'Grammar', 'Learn the Arabic grammar needed to understand Qur''anic Arabic.', '/images/courses/qawaidul-quran.png', 'PUBLISHED', 3),
  ('course_tarjamatul_quran', 'tarjamatul-quran', 'Tarjamatul-Qur''an', 'Translation', 'Translate Qur''anic Arabic accurately with structured practice.', '/images/courses/tarjamatul-quran.png', 'PUBLISHED', 4)
ON CONFLICT (url_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();