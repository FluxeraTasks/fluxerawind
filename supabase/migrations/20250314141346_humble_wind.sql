/*
  # Update workspace-images bucket policies

  1. Changes
    - Make workspace-images bucket public
    - Update storage policies for better access control

  2. Security
    - Allow public read access to workspace images
    - Maintain authenticated-only upload/delete access
*/

-- Make the bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'workspace-images';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload workspace images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their workspace images" ON storage.objects;
DROP POLICY IF EXISTS "Users can read workspace images" ON storage.objects;

-- Create new policies
CREATE POLICY "Public can view workspace images"
ON storage.objects FOR SELECT
USING (bucket_id = 'workspace-images');

CREATE POLICY "Authenticated users can upload workspace images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'workspace-images'
);

CREATE POLICY "Authenticated users can update their workspace images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'workspace-images')
WITH CHECK (bucket_id = 'workspace-images');

CREATE POLICY "Authenticated users can delete their workspace images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'workspace-images');