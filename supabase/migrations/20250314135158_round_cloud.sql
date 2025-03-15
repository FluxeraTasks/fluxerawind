/*
  # Update workspaces table for optional image

  1. Changes
    - Make image_url nullable in workspaces table
    - Add storage bucket for workspace images

  2. Security
    - Add storage policies for authenticated users
*/

-- Make image_url nullable
ALTER TABLE workspaces ALTER COLUMN image_url DROP NOT NULL;

-- Enable Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('workspace-images', 'workspace-images', false);

-- Storage Policies
CREATE POLICY "Authenticated users can upload workspace images"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'workspace-images'
);

CREATE POLICY "Users can update their workspace images"
ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'workspace-images'
) WITH CHECK (
  bucket_id = 'workspace-images'
);

CREATE POLICY "Users can read workspace images"
ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'workspace-images'
);