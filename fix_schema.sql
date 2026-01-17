ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS data jsonb;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS din text;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS original_permit_id text;
