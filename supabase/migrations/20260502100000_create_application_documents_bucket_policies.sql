-- Enable authenticated users to upload, update, and delete their own files in application_documents bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'application_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'application_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'application_documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to read all files (for viewing)
CREATE POLICY "Allow authenticated users to read files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'application_documents');