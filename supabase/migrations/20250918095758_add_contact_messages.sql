                                          -- Create the table for contact form submissions
CREATE TABLE
  contact_messages (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone ('utc'::text, NOW()) NOT NULL,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT
  );

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a message
CREATE POLICY "Allow public insert for anyone" ON public.contact_messages FOR INSERT
WITH
  CHECK (TRUE);

-- Allow users with 'Admin' role from the public.users table to read all messages
CREATE POLICY "Allow admin read access" ON public.contact_messages FOR
SELECT
  USING (
    (
      SELECT
        role
      FROM
        public.users
      WHERE
        uid = auth.uid ()
    ) = 'Admin'
  );

-- Allow users with 'Admin' role to delete messages
CREATE POLICY "Allow admin delete access" ON public.contact_messages FOR DELETE USING (
  (
    SELECT
      role
    FROM
      public.users
    WHERE
      uid = auth.uid ()
  ) = 'Admin'
);
