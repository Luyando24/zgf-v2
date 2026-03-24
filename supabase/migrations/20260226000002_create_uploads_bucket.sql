-- Migration: Create uploads bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true) 
ON CONFLICT (id) DO NOTHING;

-- Policies for public reading
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');

-- Policies for authenticated users to upload and delete
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');

DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'uploads');

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'uploads');
