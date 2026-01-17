@echo off
echo ----------------------------------------------------------------
echo      FIXING DATABASE SCHEMA
echo ----------------------------------------------------------------
echo.
echo We need to add the missing columns to your Supabase database.
echo.
echo I have copied the following SQL to your clipboard:
echo.
echo    ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS data jsonb;
echo    ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS din text;
echo    ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS original_permit_id text;
echo.
echo ----------------------------------------------------------------
echo 1. I will now open the Supabase SQL Editor in your browser.
echo 2. Please PASTE (Ctrl+V) the code into the editor.
echo 3. Click the "Run" button.
echo ----------------------------------------------------------------
echo.
echo Generating SQL...
(
echo ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS data jsonb;
echo ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS din text;
echo ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS original_permit_id text;
) > fix_schema.sql

type fix_schema.sql | clip
echo SQL copied to clipboard!

echo Opening browser...
start https://supabase.com/dashboard/project/unpjwhhmobtcelwxrixl/sql/new

echo.
echo Done! After you run the SQL in the browser, try submitting the form again.
pause
