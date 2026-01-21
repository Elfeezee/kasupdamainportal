-- Fix the transactions table to properly link to applications
-- This handles the case where application_id might already be BIGINT or TEXT

-- Step 1: Check current state and add foreign key if it doesn't exist
DO $$
BEGIN
    -- Drop the constraint if it exists (in case of retry)
    IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_transactions_application'
    ) THEN
        ALTER TABLE public.transactions DROP CONSTRAINT fk_transactions_application;
    END IF;

    -- Add the foreign key constraint
    -- This will fail if application_id is still TEXT type
    ALTER TABLE public.transactions
    ADD CONSTRAINT fk_transactions_application
    FOREIGN KEY (application_id)
    REFERENCES public.applications(id)
    ON DELETE CASCADE;

EXCEPTION
    WHEN OTHERS THEN
        -- If it fails, application_id is likely TEXT, so we need to convert it
        RAISE NOTICE 'Foreign key creation failed, attempting to convert application_id type...';
        
        -- Add a new BIGINT column
        ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS application_id_temp BIGINT;
        
        -- Copy data, converting TEXT to BIGINT where possible
        UPDATE public.transactions
        SET application_id_temp = CAST(application_id AS BIGINT)
        WHERE application_id IS NOT NULL;
        
        -- Drop old column and rename new one
        ALTER TABLE public.transactions DROP COLUMN application_id;
        ALTER TABLE public.transactions RENAME COLUMN application_id_temp TO application_id;
        
        -- Now add the foreign key
        ALTER TABLE public.transactions
        ADD CONSTRAINT fk_transactions_application
        FOREIGN KEY (application_id)
        REFERENCES public.applications(id)
        ON DELETE CASCADE;
END $$;

-- Step 2: Create index for performance
CREATE INDEX IF NOT EXISTS idx_transactions_application_id 
ON public.transactions(application_id);
