-- Allow admin users to read all files in the application_documents bucket
CREATE POLICY "Allow admin to read all files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'application_documents' AND 
  (SELECT role FROM public.users WHERE uid = auth.uid()) = 'Admin'
);
