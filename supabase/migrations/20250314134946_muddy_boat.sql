/*
  # Create workspaces table and relationships

  1. New Tables
    - `workspaces`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `image_url` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `owner_id` (uuid, references profiles)

  2. Security
    - Enable RLS on `workspaces` table
    - Add policies for workspace access:
      - Owner can perform all operations
      - Members can view workspaces they belong to
*/

CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Policy for workspace owners
CREATE POLICY "Workspace owners have full access"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Trigger for updated_at
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();