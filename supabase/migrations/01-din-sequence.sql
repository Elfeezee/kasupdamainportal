
-- Add a new column to the applications table to store the sequential DIN ID
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS din_id BIGINT;

-- Create a sequence to auto-increment the DIN ID
CREATE SEQUENCE IF NOT EXISTS applications_din_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;

-- Set the default value of the new din_id column to the next value from the sequence
-- This ensures every new application gets a unique, sequential number.
ALTER TABLE public.applications
ALTER COLUMN din_id SET DEFAULT nextval('applications_din_id_seq'::regclass);

-- Make the sequence owned by the table column, so it's automatically dropped if the column is.
ALTER SEQUENCE applications_din_id_seq OWNED BY public.applications.din_id;
