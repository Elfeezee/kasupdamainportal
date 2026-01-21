-- Fix the data type mismatch between transactions.application_id and applications.id
-- Convert application_id from TEXT to BIGINT to match applications.id

-- Step 1: Drop the column and recreate it with the correct type
ALTER TABLE public.transactions
DROP COLUMN IF EXISTS application_id;

ALTER TABLE public.transactions
ADD COLUMN application_id BIGINT;

-- Step 2: Add the foreign key constraint
ALTER TABLE public.transactions
ADD CONSTRAINT fk_transactions_application
FOREIGN KEY (application_id)
REFERENCES public.applications(id)
ON DELETE CASCADE;

-- Step 3: Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_application_id 
ON public.transactions(application_id);
