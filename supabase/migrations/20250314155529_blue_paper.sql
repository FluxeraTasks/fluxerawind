/*
  # Create artifacts table

  1. New Tables
    - `artifacts`
      - `id` (uuid, primary key)
      - `workspace_id` (uuid, foreign key to workspaces)
      - `name` (text)
      - `data` (jsonb)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `artifacts` table
    - Add policies for workspace members to read artifacts
    - Add policies for workspace editors to manage artifacts
*/

CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- Members can view artifacts
CREATE POLICY "Members can view artifacts"
  ON artifacts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = artifacts.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Editors can manage artifacts
CREATE POLICY "Editors can manage artifacts"
  ON artifacts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = artifacts.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = artifacts.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
  );

-- Workspace owners have full access
CREATE POLICY "Workspace owners can manage artifacts"
  ON artifacts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = artifacts.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = artifacts.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
  );

-- Trigger to update updated_at column
CREATE TRIGGER update_artifacts_updated_at
  BEFORE UPDATE ON artifacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();