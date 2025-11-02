-- src/supabase/migrations/01-din-sequence.sql

-- Create a sequence for the DIN IDs if it doesn't already exist
CREATE SEQUENCE IF NOT EXISTS public.applications_din_id_seq;

-- Add the din_id column to the applications table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='din_id') THEN
    ALTER TABLE public.applications
    ADD COLUMN din_id BIGINT NOT NULL DEFAULT nextval('public.applications_din_id_seq');
  END IF;
END
$$;

-- Own the sequence by the table column, so it's dropped if the column is dropped
ALTER SEQUENCE public.applications_din_id_seq OWNED BY public.applications.din_id;
