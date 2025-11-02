-- Add a 'read' column to the contact_messages table to track unread messages.
-- Default is FALSE, meaning all new messages are considered unread.
ALTER TABLE public.contact_messages
ADD COLUMN read BOOLEAN DEFAULT FALSE;

-- Update the RLS policy to allow admins to update the 'read' status.
-- First, drop the existing policy so it can be recreated with update permissions.
DROP POLICY IF EXISTS "Allow admin read access" ON public.contact_messages;

-- Recreate the policy with both SELECT and UPDATE permissions for admins.
CREATE POLICY "Allow admin read-write access" ON public.contact_messages FOR ALL
  USING (
    (
      SELECT
        role
      FROM
        public.users
      WHERE
        uid = auth.uid ()
    ) = 'Admin'
  )
WITH
  CHECK (
    (
      SELECT
        role
      FROM
        public.users
      WHERE
        uid = auth.uid ()
    ) = 'Admin'
  );
