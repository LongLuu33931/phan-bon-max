-- Add post_type and external_url columns to posts table
-- Run this migration on your Supabase/Postgres database

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'article',
  ADD COLUMN IF NOT EXISTS external_url text;

-- Optional: Add a check constraint for valid post types
ALTER TABLE public.posts
  ADD CONSTRAINT posts_post_type_check CHECK (post_type IN ('article', 'press'));
