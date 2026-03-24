-- Ensure the uploads bucket is public for media library previews
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow authenticated users to delete files from uploads
DROP POLICY IF EXISTS "Authenticated Delete Uploads" ON storage.objects;
CREATE POLICY "Authenticated Delete Uploads" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'uploads');
