-- Teacher registration fields (idempotent; run in the Supabase SQL Editor).
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS teaching_role TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS commit_days TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS available_times TEXT[] NOT NULL DEFAULT '{}';
